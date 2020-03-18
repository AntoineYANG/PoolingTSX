/*
 * @Author: Antoine YANG 
 * @Date: 2020-03-18 15:19:30 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2020-03-18 15:39:58
 */

import React, { Component } from "react";

export interface CoreProps {
    width: number;
    height: number;
    style?: React.CSSProperties;
}

export interface CoreState {
    values: Array<Array<number>>;
    step: number;
}

export class Core extends Component<CoreProps, CoreState, {}> {
    public constructor(props: CoreProps) {
        super(props);
        this.state = {
            values: [],
            step: 1
        };
    }

    public render(): JSX.Element {
        return (
            <div
            style={{
                display: 'inline-block',
                padding: '3px 3px 0',
                background: '#AAA',
                border: '1px solid #444',
                ...this.props.style
            }} >
                <svg width={ this.props.width } height={ this.props.height } >
                    {
                        this.state.values.map((line: Array<number>, i: number) => {
                            return line.map((d: number, j: number) => {
                                return [(
                                    <rect key={ `rect_${ i }_${ j }` }
                                    x={ j * 100 / line.length + "%" }
                                    y={ i * 100 / this.state.values.length + "%" }
                                    width={ 100 / line.length + "%" }
                                    height={ 100 / this.state.values.length + "%" }
                                    style={{
                                        stroke: "#000",
                                        fill: "#fff"
                                    }} />
                                ), (
                                    <text key={ `text_${ i }_${ j }` }
                                    x={ (j + 0.5) * 100 / line.length + "%" }
                                    y={ (i + 0.5) * 100 / this.state.values.length + "%" }
                                    textAnchor="middle"
                                    style={{
                                        fontSize: "15px",
                                        fill: "#000",
                                        transform: `translateY(4.5px)`
                                    }}>
                                        { d }
                                    </text>
                                )]
                            })
                        })
                    }
                </svg>
            </div>
        );
    }
}
