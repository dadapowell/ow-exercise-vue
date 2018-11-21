// import Vue from 'vue';
import { Scatter } from 'vue-chartjs';
import { starWarsResource } from 'src/util/resources';
import template from './chart.html';

export default {
  template: template,
  extends: Scatter,
  data() {
    return {
      datapoints: [],
      dataCollection: {},
      options: {
        responsive: true,
        title: {
          display: true,
          text: "Mass (x) vs Height (y) for All People",
          fontSize: "40",
          fontStyle: "normal",
          fontColor: "#09264a"
        },
        tooltips: {
          enabled: true
        }
      }
    }
  },
  watch: {
    datapoints: function() {
      this.renderChart(this.dataCollection, this.options)
    }
  },
  created() {
    this.fetchPeople();
  },
  methods: {
    fetchPeople(page){
      if (!page) {
        this.people = [];
      }
      return starWarsResource.get('/people/' + (page ? `?page=${page}`: ''))
        .then((response) => {
          let newDataPoints = response.data.results.map(dp => Object.assign({}, { name: dp.name, x: isNaN(dp.mass) ? 0 : Number(dp.mass), y: isNaN(dp.height)? 0 : Number(dp.height) }));
          this.datapoints = this.datapoints.concat(newDataPoints);
          if (response.data.next) {
            let nextPage = page ? ++page : 2;
            return this.fetchPeople(nextPage)
          } else {
            this.fillData();
          }
        })
        .catch((errorResponse) => {
          // Handle error...
          console.log('API responded with:', errorResponse);
        });
    },
    fillData() {
      this.dataCollection = {
        datasets: [
          {
            label: 'People',
            backgroundColor: '#f99820',
            data: this.datapoints
          }
        ]
      }
    }
  }
};
