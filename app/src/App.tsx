import React, { Component } from 'react';
import './App.css';
import { PicBox } from './PicBox';
import { Core } from './Core';

class App extends Component<{}, {}, {}> {
  private picOrigin?: PicBox;
  private picAfter?: PicBox;
  private picAfter2?: PicBox;
  private picAfter3?: PicBox;
  private core?: Core;
  private core2?: Core;

  public constructor(props: {}) {
    super(props);
  }

  public render(): JSX.Element {
    return (
      <div className="App">
        <PicBox ref="PicBox_Origin" id="PicBox_Origin" width={ 500 } height={ 500 } />
        <Core ref="core" width={ 500 } height={ 500 } />
        <PicBox ref="PicBox_After" id="PicBox_After" width={ 500 } height={ 500 } />
        <PicBox ref="PicBox_After2" id="PicBox_After2" width={ 500 } height={ 500 }
        reverse={ true } twoValue={ true } />
        <br />
        <Core ref="core2" width={ 500 } height={ 500 } />
        <PicBox ref="PicBox_After3" id="PicBox_After3" width={ 500 } height={ 500 } />
      </div>
    );
  }

  public componentDidMount(): void {
    this.picOrigin = (this.refs["PicBox_Origin"] as PicBox);
    this.core = (this.refs["core"] as Core);
    this.core2 = (this.refs["core2"] as Core);
    this.core.setState({
      values: [
        [1, 0, 0, 0, 1],
        [0, 1, 0, 1, 0],
        [0, 0, -9, 0, 0],
        [0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1]
      ],
      step: 1
    });
    this.core2.setState({
      values: [
        [2, 1, -1],
        [1, 0, -0.5],
        [-1, -0.5, 0]
      ],
      step: 1
    });
    this.picAfter = (this.refs["PicBox_After"] as PicBox);
    this.picAfter2 = (this.refs["PicBox_After2"] as PicBox);
    this.picAfter3 = (this.refs["PicBox_After3"] as PicBox);
    const img: CanvasImageSource = new Image(500, 500);
    img.src = "./images/ayanami.jpg";
    // img.src = "./images/zx.JPG";
    img.onload = () => {
      this.picOrigin!.setState({
        pic: {
          img: img,
          x: 0,
          y: 0,
          width: 500,
          height: 500
        }
      });
      this.picOrigin!.pool(this.core!, this.picAfter!);
      this.picOrigin!.pool(this.core!, this.picAfter2!);
      this.picOrigin!.pool(this.core2!, this.picAfter3!);
    };
  }
}

export default App;
