// // import 'chart.js'
// import { Bar } from 'vue-chartjs';

// export default Bar.extend({
//   mounted() {
//     this.renderChart(
//       {
//         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
//         datasets: [
//           {
//             label: 'Data One',
//             backgroundColor: '#f87979',
//             data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
//           }
//         ]
//       },
//       { responsive: true, maintainAspectRatio: false }
//     );
//   }
// });
import { Component } from 'vue-property-decorator';
import { mixins } from 'vue-class-component';
import { Bar } from 'vue-chartjs';

@Component({
  name: 'BarChart'
})
export default class BarChart extends mixins(Bar) {
  mounted() {
    this.renderChart(
      {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        datasets: [
          {
            label: 'Data One',
            backgroundColor: '#f87979',
            data: [40, 20, 12, 39, 10, 40, 39, 80, 40, 20, 12, 11]
          }
        ]
      },
      { responsive: true, maintainAspectRatio: false }
      // labels: ['1', '2', '3', '4', '5', '6'],
      // datasets: [
      //   {
      //     label: 'Chart',
      //     data: [300, 700, 500, 700, 200, 800],
      //   }
      // ]
    );
  }
}
