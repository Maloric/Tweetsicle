import { Component, ElementRef, Input, OnChanges, ViewChild, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-insights',
  templateUrl: './insights.component.html',
  styleUrls: ['./insights.component.scss']
})
export class InsightsComponent implements OnChanges {

  private stepWidth = 10;

  @ViewChild('chart')
  private chartContainer: ElementRef;

  @Input()
  hashtags: { [key: string]: number };

  @Output() onBarClicked = new EventEmitter<string>();

  private keys: string[];

  constructor() { }

  ngOnChanges(changes: SimpleChanges) {
    this.keys = Object.keys(this.hashtags);

    this.updateChart();
  }

  updateChart() {
    let bars = d3.select(this.chartContainer.nativeElement)
      .selectAll('div')
      .data(this.keys.slice(0, 10));

    bars.enter()
      .append('div')
      .attr('class', 'bar')
      .style('width', (key) => this.getBarWidth(key))
      .text(key => this.getBarText(key));

    bars.exit().remove();

    bars.transition()
      .style('width', (key) => this.getBarWidth(key))
      .text(key => this.getBarText(key));
  }

  getBarText(key): string {
    return `#${key} (${this.hashtags[key]})`;
  }

  getBarWidth(key): string {
    if (!this.hashtags) {
      return '0';
    }
    let highest = this.hashtags[this.keys[0]] * this.stepWidth;

    if (highest <= 100) {
      return this.hashtags[key] * this.stepWidth + '%';
    }
    let width = (this.hashtags[key] / highest) * 100 * this.stepWidth;
    return width + '%';
  }

}
