/*
 * @Author: Antoine YANG 
 * @Date: 2020-03-18 11:45:55 
 * @Last Modified by: Antoine YANG
 * @Last Modified time: 2020-03-18 21:36:56
 */

import React, { Component } from "react";
import { Core } from "./Core";

export interface PicBoxProps {
    id: string;
    width: number;
    height: number;
    style?: React.CSSProperties;
    reverse?: boolean;
    twoValue?: boolean;
}

export interface Pic {
    img: CanvasImageSource;
    x: number;
    y: number;
    width: number;
    height: number;
}

export interface PicBoxState {
    pic?: Pic;
}


export class PicBox extends Component<PicBoxProps, PicBoxState, {}> {
    private ctx?: CanvasRenderingContext2D;
    private timers: Array<NodeJS.Timeout>;

    public constructor(props: PicBoxProps) {
        super(props);
        this.state = {
            pic: void 0
        };
        this.timers = [];
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
                <canvas key="canvas" id={ this.props.id } width={ this.props.width } height={ this.props.height }
                style={{
                    background: '#EEE'
                }} />
            </div>
        );
    }

    public componentDidMount(): void {
        this.ctx = (document.getElementById(this.props.id) as HTMLCanvasElement).getContext("2d")!;
    }

    public componentWillUnmount(): void {
        this.timers.forEach((timer: NodeJS.Timeout) => {
            clearTimeout(timer);
        });
        this.timers = [];
    }

    public componentDidUpdate(): void {
        this.timers.forEach((timer: NodeJS.Timeout) => {
            clearTimeout(timer);
        });
        this.timers = [];
        this.ctx!.clearRect(0, 0, this.props.width, this.props.height);
        if (this.state.pic) {
            this.ctx!.drawImage(
                this.state.pic.img,
                this.state.pic.x,
                this.state.pic.y,
                this.state.pic.width,
                this.state.pic.height,
                0,
                0,
                this.props.width,
                this.props.height
            );
        }
    }

    private cm(d: number): number {
        return Math.min(Math.max(0, d), 255);
    }
    
    public pool(core: Core, target: PicBox): void {
        if (!this.state.pic) {
            return;
        }

        let i: number = 0;
        let j: number = 0;

        const loop: () => void = () => {
            if (j >= this.props.width) {
                j = 0;
                i += core.state.step;
            }
            if (i >= this.props.height) {
                return;
            }

            // (j, i) is the center cordinate of the core
            let r: number = 0;
            let g: number = 0;
            let b: number = 0;
            let a: number = 0;
            // Add up the weighted values
            for (let _y: number = 0; _y < core.state.values.length; _y++) {
                for (let _x: number = 0; _x < core.state.values[_y].length; _x++) {
                    const w: number = core.state.values[_y][_x];
                    if (w === 0) {
                        continue;
                    }
                    const rgba: Uint8ClampedArray = this.ctx!.getImageData(
                        _x + j - core.state.values.length / 2,
                        _y + i - core.state.values[_y].length / 2,
                        1,
                        1
                    ).data;
                    r += rgba[0] * w;
                    g += rgba[1] * w;
                    b += rgba[2] * w;
                    a += rgba[3] * w;
                }
            }
            target.ctx!.fillStyle = this.stringify(
                [r, g, b, r | g | b ? 255 : a],
                target.props.reverse,
                target.props.twoValue
            );
            target.ctx!.fillRect(j, i, core.state.step, core.state.step);

            j += core.state.step;

            this.timers.push(
                setTimeout(loop, 0)
            );
        };
        
        loop();
    }
    
    private stringify(rgba: [number, number, number, number], reverse?: boolean, twoValue?: boolean): string {
        const r: number = this.cm(rgba[0]);
        const g: number = this.cm(rgba[1]);
        const b: number = this.cm(rgba[2]);
        const a: number = this.cm(rgba[3]);
        if (reverse) {
            if (twoValue) {
                return (r + g + b) >= 32 ? '#000f' : '#ffff';
            } else {
                return `rgba(${255 - r},${255 - g},${255 - b},${a})`;
            }
        } else {
            if (twoValue) {
                return (r + g + b) < 32 ? '#000f' : '#ffff';
            }
            return `rgba(${r},${g},${b},${a})`;
        }
    }
}
