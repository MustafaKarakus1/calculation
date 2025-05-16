import React, { useState, useEffect } from "react";

// Replace parsers with Yusuf and Mustafa
const parsers = ["Yusuf", "Mustafa"];
const operators = ["+", "-", "*", "/"];
const parantheses = ["(", ")"];

function App() {
  const [type, setType] = useState("");
  const [value, setValue] = useState("");
  const [showInput, setShowInput] = useState(false);
  const [formula, setFormula] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [calculationSteps, setCalculationSteps] = useState([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [calculationInProgress, setCalculationInProgress] = useState(false);
  const [parserValues, setParserValues] = useState({
    Yusuf: [],
    Mustafa: []
  });
  const [frameIDs, setFrameIDs] = useState([]); 
  const [selectedFrameID, setSelectedFrameID] = useState(null);
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('');
  
  useEffect(() => {
    fetchParserValues();
    fetchFrameIDs();
  }, []);

  const fetchFrameIDs = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/frame-ids"); 
      const data = await response.json();
      console.log('data', data)
      if (data.success) {
        setFrameIDs(data.frameIDs); 
      }
    } catch (error) {
      console.error("Error fetching frame IDs:", error);
    }
  };

  
  useEffect(() => {
    if (calculationSteps.length > 0 && currentStepIndex < calculationSteps.length && calculationInProgress) {
      const timer = setTimeout(() => {
        setResult(calculationSteps[currentStepIndex].result);
        setCurrentStepIndex(currentStepIndex + 1);
        
        if (currentStepIndex === calculationSteps.length - 1) {
          setCalculationInProgress(false);
        }
      },1000);
      
      return () => clearTimeout(timer);
    }
  }, [calculationSteps, currentStepIndex, calculationInProgress]);

  const fetchParserValues = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/parser-values");
      const data = await response.json();
      if (data.success) {
        setParserValues(data.values);
      }
    } catch (error) {
      console.error("Error fetching parser values:", error);
    }
  };

  const resetParserValues = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/reset-values", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        }
      });
      const data = await response.json();
      if (data.success) {
        setParserValues(data.values);
      }
    } catch (error) {
      console.error("Error resetting parser values:", error);
    }
  };

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setValue("");
    setShowInput(true);
  };

  const handleAdd = () => {
    if (value.trim() === "") return;
    
    const newItem = { type, value };
    
    if (formula.length === 0) {
      setFormula([...formula, newItem]);
      setType("");
      setValue("");
      setShowInput(false);
      return;
    }
    
    const lastItem = formula[formula.length - 1];
    
    if (
      (lastItem.type === "Constant" && type === "Constant") ||
      (lastItem.type === "Parser" && type === "Parser") ||
      (lastItem.type === "Operator" && type === "Operator") ||
      (lastItem.type === "Constant" && type === "Parser") ||
      (lastItem.type === "Parser" && type === "Constant") ||
      (lastItem.type === "Parantheses" && type === "Parantheses" && lastItem.value === value)
    ) {
      alert("İki aynı türde değer yan yana eklenemez!");
      return;
    }
    
    setFormula([...formula, newItem]);
    setType("");
    setValue("");
    setShowInput(false);
  };

  const handleEdit = () => {
    if (value.trim() === "") return;
  
    const updatedItem = { type, value };
    const updated = [...formula];
  
    // Düzenlenen elemanın indeksini al
    const currentIndex = editIndex;
  
    // Sol ve sağdaki elemanları kontrol et
    const leftItem = updated[currentIndex - 1]; // Solundaki eleman
    const rightItem = updated[currentIndex + 1]; // Sağındaki eleman
  
    // Kontrol: Sol ve sağdaki elemanlarla karşılaştır
    if (
      (leftItem && leftItem.type === type) || // Sol eleman ile aynı tür
      (rightItem && rightItem.type === type) || // Sağ eleman ile aynı tür
      (leftItem && leftItem.type === "Constant" && type === "Parser") || // Sol eleman Constant, düzenlenen Parser
      (rightItem && rightItem.type === "Constant" && type === "Parser") || // Sağ eleman Constant, düzenlenen Parser
      (leftItem && leftItem.type === "Parantheses" && type === "Parantheses" && leftItem.value === value) || // Sol eleman Parantheses
      (rightItem && rightItem.type === "Parantheses" && type === "Parantheses" && rightItem.value === value) // Sağ eleman Parantheses
    ) {
      alert("İki aynı türde değer yan yana eklenemez!");
      return;
    }
  
    // Eğer kontrol geçerse, güncellemeyi yap
    updated[currentIndex] = updatedItem;
    setFormula(updated);
    setEditIndex(null);
    setSelectedIndex(null);
    setType("");
    setValue("");
    setShowInput(false);
  };
  
  const handleDoubleClick = (index) => {
    setEditIndex(index);
    setSelectedIndex(index);
    setType(formula[index].type);
    setValue(formula[index].value);
    setShowInput(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    setEditIndex(null);
    setValue("");
  };

  const handleClear = () => {
    if (editIndex !== null) {
      const updated = [...formula];
      updated.splice(editIndex, 1);
      setFormula(updated);
      setEditIndex(null);
      setSelectedIndex(null);
    } else {
      setFormula([]);
      setResult(null);
      setSelectedIndex(null);
      setEditIndex(null);
      setType("");
      setValue("");
      setShowInput(false);
      setCalculationSteps([]);
      setCurrentStepIndex(0);
      setCalculationInProgress(false);
    }
  };

  const handleCalculate = async () => {
    if (formula.length === 0) {
      alert("No values to calculate");
      return;
    }
  
    setResult(null);
    setCalculationSteps([]);
    setCurrentStepIndex(0);
  
    try {
      const parenthesesResponse = await fetch("http://localhost:5000/api/validate-parentheses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formula }),
      });
      console.log("Gönderilen veriler:", formula);

      const parenthesesData = await parenthesesResponse.json();
  
      if (!parenthesesData.success) {
        alert(parenthesesData.error);
        return;
      }
  
      const response = await fetch("http://localhost:5000/api/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formula }),
      });
      
      const data = await response.json();
      console.log("Backend'den gelen cevap:", data);
      if (data.success) {
        if (data.steps && data.steps.length > 0) {
          setCalculationSteps(data.steps);
          setCurrentStepIndex(0);
          setCalculationInProgress(true);
          setResult(null); // Clear result initially
        } else {
          setResult(data.result);
        }
        await fetch("http://localhost:5000/api/save-formula", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({formula,  frameId: selectedFrameID, name , unit}),
        });
      } else {
        alert(data.error || "Hesaplama sırasında bir hata oluştu");
      }
    } catch (error) {
      alert("Sunucu bağlantısı sırasında bir hata oluştu");
      console.error("Calculation error:", error);
    }
  };
  

  const renderInput = () => {
    if (type === "Constant") {
      return (
        <input
          type="text"
          placeholder="Enter your constant value"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      );
    } else if (type === "Parser") {
      return (
        <select value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">Select Parser</option>
          {parsers.map((parser) => (
            <option key={parser} value={parser}>{parser}</option>
          ))}
        </select>
      );
    } else if (type === "Operator") {
      return (
        <select value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">Select Operator</option>
          {operators.map((operator) => (
            <option key={operator} value={operator}>{operator}</option>
          ))}
        </select>
      );
    } else if (type === "Parantheses") {
      return (
        <select value={value} onChange={(e) => setValue(e.target.value)}>
          <option value="">Select Parantheses</option>
          {parantheses.map((paranthesis) => (
            <option key={paranthesis} value={paranthesis}>{paranthesis}</option>
          ))}
        </select>
      );
    }
    return null;
  };

  const renderParserValues = () => {
    if (!parserValues.Yusuf.length || !parserValues.Mustafa.length) return null;
    
    return (
      <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px", borderRadius: "5px" }}>
        <h3>Current Parser Values</h3>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <h4>Yusuf</h4>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {parserValues.Yusuf.map((value, index) => (
                <li key={`yusuf-${index}`}>{index + 1}: {value}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4>Mustafa</h4>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {parserValues.Mustafa.map((value, index) => (
                <li key={`mustafa-${index}`}>{index + 1}: {value}</li>
              ))}
            </ul>
          </div>
        </div>
        <button
          style={{ marginTop: "10px", borderRadius: "5px", cursor: "pointer" }}
          onClick={resetParserValues}
        >
          Reset Parser Values
        </button>
      </div>
    );
  };

  const renderCalculationInfo = () => {
    if (!calculationSteps.length || !calculationInProgress) return null;
    
    const currentStep = calculationSteps[currentStepIndex > 0 ? currentStepIndex - 1 : 0];
    
    return (
      <div style={{ marginTop: "10px", padding: "5px", border: "1px solid #ccc", borderRadius: "5px" }}>
        <h4>Calculation Step {currentStepIndex} of {calculationSteps.length}</h4>
        <p>
          <strong>Expression:</strong> {currentStep.expression}
        </p>
        <p>
          <strong>Substitutions:</strong> Yusuf = {currentStep.substitutions?.Yusuf || 'N/A'}, 
          Mustafa = {currentStep.substitutions?.Mustafa || 'N/A'}
        </p>
      </div>
    );
  };

  return (
    <div
      style={{
        marginLeft: "25px",
        width: "800px",
        border: "1px solid #333",
        marginTop: "50px",
        backgroundColor: "ButtonFace",
        borderRadius: "5px",
        padding: "10px",
      }}
    >
      <h2
        style={{
          border: "1px solid #333",
          width: "300px",
          marginLeft: "10px",
          borderRadius: "5px",
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        Parser Calculator
      </h2>
      
      <select
        style={{ marginLeft: "10px", marginRight: "10px", cursor: "pointer" }}
        value={type}
        onChange={handleTypeChange}
      >
        <option value="">Select Type</option>
        <option value="Constant">Constant</option>
        <option value="Parser">Parser</option>
        <option value="Operator">Operator</option>
        <option value="Parantheses">Parantheses</option>
      </select>
      <select
        style={{ marginLeft: "10px", marginRight: "10px", cursor: "pointer" }}
        value={selectedFrameID} 
        onChange={(e) => setSelectedFrameID(e.target.value)} 
      >
        <option value="">Select FrameID</option>
        {frameIDs.map((frameId) => (
          <option key={frameId} value={frameId}>{frameId}</option>
        ))}
      </select>
      {showInput && (
        <>
          {renderInput()}
          <button
            style={{ marginLeft: "10px" }}
            onClick={editIndex !== null ? handleEdit : handleAdd}
          >
            {editIndex !== null ? "Edit" : "Add"}
          </button>
        </>
      )}
      
      <div
        style={{
          border: "1px solid #333",
          width: "700px",
          marginLeft: "10px",
          marginTop: "15px",
          borderRadius: "5px",
          display: "flex",
          flexWrap: "wrap",
          minHeight: "40px",
          padding: "5px",
        }}
      >
        {formula.map((item, index) => (
          <div
            key={index}
            onDoubleClick={() => handleDoubleClick(index)}
            style={{
              marginRight: "8px",
              marginBottom: "5px",
              padding: "5px",
              borderRadius: "3px",
              cursor: "pointer",
              backgroundColor: selectedIndex === index ? "#c0e0ff" : (isEditing && editIndex === index ? "#f0f0f0" : "transparent"),
              border: selectedIndex === index ? "2px solid rgb(116, 160, 247)" : "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            {isEditing && editIndex === index ? (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onBlur={handleBlur}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleAdd();
                    handleBlur();
                  }
                }}
                autoFocus
                style={{ marginRight: "5px" }}
              />
            ) : (
              <span>{item.value}</span>
            )}
          </div>
        ))}
      </div>
      <input style={{marginLeft:"10px" , borderRadius:"5px"}} placeholder="Enter the name" value={name} onChange={(e) => setName(e.target.value)} ></input>
      <input style={{marginLeft:"10px" , borderRadius:"5px"}} placeholder="Enter the unit" value={unit} onChange={(e) => setUnit(e.target.value)} ></input>

      <button
        style={{ margin: "10px", borderRadius: "5px", cursor: "pointer" }}
        onClick={handleCalculate}
        disabled={calculationInProgress}
      >
        Send
      </button>
      
      <button
        style={{ margin: "10px", borderRadius: "5px", cursor: "pointer" }}
        onClick={handleClear}
      >
        Clear
      </button>
      
      {renderParserValues()}
      
      {renderCalculationInfo()}
      
      {result !== null && (
        <div
          style={{
            margin: "10px",
            padding: "10px",
            backgroundColor: "#e6ffe6",
            borderRadius: "5px",
            border: "1px solid rgb(116, 160, 247)",
          }}
        >
          <h3>Result: {result}</h3>
        </div>
      )}
    </div>
  );
}

export default App;