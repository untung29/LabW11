import { Component } from "@angular/core";
import { ChartType, ChartOptions } from "chart.js";
import * as io from "socket.io-client";
import {
  SingleDataSet,
  Label,
  monkeyPatchChartJsLegend,
  monkeyPatchChartJsTooltip,
} from "ng2-charts";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  // For sending back to the client
  question = "";
  text = [];
  options = [];
  count = [];
  chosenVote = "";

  // Assigning Color
  colors: any[] = [
    {
      backgroundColor: [
        "lightblue",
        "red",
        "green",
        "violet",
        "yellow",
        "cyan",
        "lightgray",
        "slateblue",
        "violet",
        "gray",
      ],
    },
  ];

  // Socket IO Configuration
  socket: SocketIOClient.Socket;

  public pieChartOptions: ChartOptions = {
    responsive: true,
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: SingleDataSet[] = [];
  public pieChartType: ChartType = "pie";
  public pieChartLegend = true;
  public pieChartPlugins = [];

  constructor() {
    this.socket = io.connect();
    monkeyPatchChartJsTooltip();
    monkeyPatchChartJsLegend();
  }

  ngOnInit() {
    this.pieChartLabels = new Array();
    this.pieChartData = new Array();

    this.socket.on("pollObject", (data) => {
      this.question = data.question;
      data.options.forEach((data) => {
        this.text.push(data.text);
        this.options.push({ value: data.value, text: data.text });
        this.count.push(data.count);
      });
      this.pieChartLabels = this.text;
      this.pieChartData = this.count;
    });

    this.socket.on("updatedPoll", (data) => {
      this.pieChartData = [];
      this.count = [];
      for (let i = 0; i < data.options.length; i++) {
        this.pieChartData.push(data.options[i].count);
        this.count.push(data.options[i].count);
      }
    });
  }

  selectedVote(value) {
    this.chosenVote = value;
    this.socket.emit("incrementPoll", { value: this.chosenVote });
    let count = -1;
    this.options.forEach((data) => {
      count += 1;
      if (data.value === this.chosenVote) {
        let totalVote = this.count[count] + 1;
        alert(
          "Thank you for voting " +
            data.text +
            " There are now " +
            totalVote +
            " for option " +
            data.text
        );
      }
    });
    count = -1;
  }
}
