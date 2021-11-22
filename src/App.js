import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';

const inputMatrix = [];

for (let i = 0; i <= 5; i++) {
  const row = []
  for (let j = 0; j <= 6; j++) {
    const max = 8;
    const number = Math.floor(Math.random() * max + 1);
    row.push(number);
  }
  inputMatrix.push(row);
}

class DimInput extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {

    return (
      <div className="inputs">
        <div className="dimensions">
          <div>Rows:<input type="number" min="5" max="8" value={this.props.rowsNum} onChange={this.props.changeRows} /></div>   
          <div>Columns:<input type="number" min="6" max="10" value={this.props.columnsNum} onChange={this.props.ChangeColumns} /></div>
          <button onClick={this.props.generateInput}>Generate</button>
        </div> 
            
      </div>
    );
  }
}

class OffsetInput extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {

    return (
      <div className="inputs">
        <div className="offsets">
          <div>Distance Offset:<input type="number" min="1" value={this.props.distanceInput} onChange={this.props.handleDistanceChange} placeholder="Distance 1,2, 3,..." /></div>   
          <div>Direction Offset:
            <select id="select" onChange={this.props.handleDirectionChange}>
                <option value={0}>0</option>
                <option value={45}>45</option>
                <option value={90}>90</option>
                <option value={135}>135</option>
            </select>
          </div>
        </div> 
            
      </div>
    );
  }
}

class InputSquare extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    const id = this.props.id;
    const inputSquare = <span id={this.props.id} className="square">{this.props.value}</span>
    const coloredSquare = <span id={this.props.id} className="square coloredSquare">{this.props.value}</span>

    return (
      this.props.colored ? coloredSquare: inputSquare 
    );
  }
}

class OutputSquare extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    const id = this.props.id;
   
    const outputSquare = <button id={this.props.id} className="square outputSquare" onClick={() => this.props.handleClick(id)}>{this.props.value}</button>
    const clickedSquare = <button id={this.props.id} className="square outputSquare clickedSquare" onClick={() => this.props.handleClick(id)}>{this.props.value}</button>
    const unclickableSquare = <button id={this.props.id} className="square outputSquare unclickableSquare" >{this.props.value} </button>
    const nullSquare = <div className="square outputSquare unclickableSquare"></div>

    const clicked = this.props.clicked
    const stringId =  id.toString();
    const unclickable = stringId[0] == 0 || stringId[1] == 0;
    const isNull = id == 0;

    return (
      isNull ? nullSquare : unclickable ? unclickableSquare : clicked ? clickedSquare : outputSquare 
    );
  }
}

class Matrix extends React.Component {
  constructor (props) {
    super (props);
  }

  render () {
    const matrix = this.props.matrix.map((row, rowId) => {
      return <div className="row">{row.map((number, numberId) => {
        const id = rowId + "" + numberId;
        return this.props.type == "input" ? <InputSquare value={number} id={id} colored={this.props.coloredSquares.includes(id)} /> : 
        <OutputSquare value={number} id={id} handleClick={this.props.handleClick} clicked={this.props.clickedSquareId == id} />
      })}</div>
    });

    return (
      <div className="matrix">{matrix}</div>
    );
  }
}

class App extends React.Component {
  constructor (props) {
    super (props);
     this.state = {
        distanceInput: 1,
        directionInput: 0,
        clickedSquareId: 99,
        rowsNum: 5,
        columnsNum: 6,
        inputMatrix: inputMatrix
     }

    this.handleDistanceChange = this.handleDistanceChange.bind(this);
    this.handleDirectionChange = this.handleDirectionChange.bind(this);
    this.handleOnClick = this.handleOnClick.bind(this);
    this.getOutputMatrix = this.getOutputMatrix.bind(this);
    this.getCount = this.getCount.bind(this);
    this.changeRows = this.changeRows.bind(this);
    this.ChangeColumns = this.ChangeColumns.bind(this);
    this.generateInput = this.generateInput.bind(this);
    this.getAngleValues = this.getAngleValues.bind(this);
  }

  handleDistanceChange (event) {
    this.setState({
      distanceInput: event.target.value
    });
  }

  handleDirectionChange (event) {
    this.setState({
      directionInput: event.target.value
    });
  }

  changeRows (event) {
    this.setState({
      rowsNum: event.target.value
    });
  }

  ChangeColumns (event) {
    this.setState({
      columnsNum: event.target.value
    });
  }

  generateInput () {
    const inputMatrix = [];

    for (let i = 0; i < this.state.rowsNum; i++) {
      const row = []
      for (let j = 0; j < this.state.columnsNum; j++) {
        const max = 8;
        const number = Math.floor(Math.random() * max + 1);
        row.push(number);
      }

      inputMatrix.push(row);
    }

    this.setState({
      inputMatrix: inputMatrix
    });
  }
 
  handleOnClick (id) {
    this.setState({
      clickedSquareId: id
    });
  }

  getOutputMatrix () {
    let matchedSquares = [];
    let outputMatrix = [];
    
		for (let i = 0; i <= 8; i++) {
			let row = [];
			for (let j = 0; j <= 8; j++) {
				if (i == 0) {
					row.push(j);
        }

        else if (j == 0) {
          row.push(i);
        }
		
				else {
          const result = (this.getCount(i, j));
          row.push(result.count);
          matchedSquares = matchedSquares.concat(result.matchedSquares);
				}

			}
		
			outputMatrix.push(row);
		}

		return {
      outputMatrix: outputMatrix,
      matchedSquares: matchedSquares
    };
  }

  getCount (value1, value2) {
    let count = 0;
    let matchedSquares = []

    const values = this.getAngleValues(); 

		let i = values.i;
		const j = values.j;
		const nextRow = values.nextRow;
		const nextColumn = values.nextColumn;
		const rowLimit = values.rowLimit;
    const columnLimit = values.columnLimit;
    
    

		for (i; i < this.state.inputMatrix.length - rowLimit; i++) {
			for (let k = j; k < this.state.inputMatrix[i].length - columnLimit; k++) {
				if (this.state.inputMatrix[i][k] == value1 && this.state.inputMatrix[i + nextRow][k + nextColumn] == value2) {
					let x = i + nextRow;
          let y = k + nextColumn;
          
					let match = {
						id: "" + value1 + value2,
						square1: "" + i + k,
						square2: "" + x + y
					}
					count += 1;

					matchedSquares.push(match);
				}

			}
		}

		return {
      count: count,
      matchedSquares: matchedSquares
    };
  }
  
  getAngleValues () {
    const distance = parseInt(this.state.distanceInput);
    const direction = this.state.directionInput.toString();
    
    const angleValues = {
      0: {
        i: 0,
        j: 0,
        nextRow: 0,
        nextColumn: distance,
        rowLimit: 0,
        columnLimit: distance
      },
      45: {
        i: distance,
        j: 0,
        nextRow: - distance,
        nextColumn: + distance,
        rowLimit: 0,
        columnLimit: distance
      },
      90: {
        i: distance,
        j: 0,
        nextRow: - distance,
        nextColumn: 0,
        rowLimit: 0,
        columnLimit: 0
      },
      135: {
        i: distance,
        j: distance,
        nextRow: - distance,
        nextColumn: - distance,
        rowLimit: 0,
        columnLimit: 0
      }
    }
    return angleValues[direction];
  }

  render () {
    const calculations = this.getOutputMatrix();
    const outputMatrix = calculations.outputMatrix;
    const matchedSquares = calculations.matchedSquares;
    
    const matches = matchedSquares.filter(item => {
			return item.id == this.state.clickedSquareId
		})

		const coloredSquares = [];
		matches.forEach (item => {
			coloredSquares.push(item.square1);
			coloredSquares.push(item.square2);
    });

    return (
      <div>
        <div className="header"><h1>Grey Level CMs CALCULATOR</h1></div>
        <div className="inputs">
          <DimInput rowsNum={this.state.rowsNum} columnsNum={this.state.columnsNum} changeRows={this.changeRows} ChangeColumns={this.ChangeColumns} generateInput={this.generateInput} />
          <OffsetInput distanceInput={this.state.distanceInput} handleDirectionChange={this.handleDirectionChange} handleDistanceChange={this.handleDistanceChange}/>
        </div>
        <div className="matrices">
          <Matrix type="input" matrix={this.state.inputMatrix} coloredSquares={coloredSquares} />
          <Matrix type="output" matrix={outputMatrix} handleClick={this.handleOnClick} clickedSquareId={this.state.clickedSquareId} />
        </div>
        
      </div>
    );
  }
}

export default App;
