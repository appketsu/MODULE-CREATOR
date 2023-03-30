import * as _ from 'lodash';
import View from '../view/view';
import Base, { AppInterface } from "../base";
import GridElement from "./gridElement";
import App from "../../app";
import { GridDesign, GridElementPosition } from "./gridInterfaces";
import {FromToNumber} from "../interfaces";
import GridSeparator from './separator/separator';
import $ from "jquery";
import { viewBaseGridHtml } from '../../view/baseGrid/baseGridView';

interface GridInterface {
    
    getGrid() : GridJs;
    // this function will pass the separator that is calling this resize,
    // we will go through all the grid elements and we will check if the resize is whthin bounds.
    // if not we will return false to the separator.
    // the separator will try to update the grid distribution with another element,
    // if after trying all the possibilites it wasnt able to do anything, it will call updateGridDistribution
    // with the last working grid design. 
    updateGridDDesign(separator: GridSeparator): boolean; 
}


export default class GridJs extends View {

    // We will have a grid distribution.

    gridDistribution:string[][] = [[]];
    gridElements : string[] = []; //
    gridDesing : GridDesign = {columns : [],rows : []};

    constructor(id?: string ,html: string = viewBaseGridHtml ) {
        super(id,html)
    }

    setDistribution(distribution: string[][]) { // we update all the GridElements position;
        this.gridDistribution = distribution;
        var newElementsPosition : {[key: string]: GridElementPosition} = {};
        for (var row = 1; row != distribution.length + 1; row ++) {
            for (var column = 1; column != distribution[row - 1].length + 1; column++) {
                let currentGridId = distribution[row - 1][column - 1];
                let currentGridEl = window.mApp.views.get(currentGridId)
                if (currentGridEl == undefined) {continue;}
                var currentElPosition : GridElementPosition;
                if (newElementsPosition[currentGridId] == undefined) { // start;
                    currentElPosition = {column: {from : column,to : column}, row: {from : row,to : row}};
                    newElementsPosition[currentGridId] = currentElPosition;
                } else {
                    currentElPosition = newElementsPosition[currentGridId];
                    currentElPosition.column.to = column + 1;
                    currentElPosition.row.to = row + 1;
                    newElementsPosition[currentGridId] = currentElPosition;
                }
            }
        }
        
        // consider updating the elements that are not on the distribution to 0 (make em dissapear)

        for (const [k, v] of Object.entries(newElementsPosition)) {
            (window.mApp.views.get(k) as GridElement).setPostion(v)
        }

        for (var x of this.gridElements) {
            let view =  window.mApp.views.get(x);
            if (newElementsPosition[x] == undefined) {
                view?.isHidden(true);
            } else {
                view?.isHidden(false)
            }
        }
    }

    setDesign(design:GridDesign) {
        this.gridDesing = design;
        let columns: string = design.columns.map((el) => {
            return `${el.size}${el.magnitude}`;
        }).join(' ');
        let rows: string= design.rows.map((el) => {
            return `${el.size}${el.magnitude}`;
        }).join(' ');
        $(`[${this.id}]`).css({'grid-template-columns':`${columns}`,'grid-template-rows':`${rows}`})
    }



}