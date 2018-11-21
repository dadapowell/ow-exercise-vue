import Vue from 'vue';

import { starWarsResource } from 'src/util/resources';
import template from './person.html';

export default Vue.extend({
  template,

  data() {
    return {
      person: {},
      vehicles: []
    };
  },

  created(){
    this.fetchPost();
  },

  methods: {
    fetchPost(){
      const id = this.$route.params.id;

      return starWarsResource.get(`people/${id}`)
        .then((response) => {
          this.person = response.data;
          if (response.data.vehicles.length) {
            this.fetchVehicles(response.data.vehicles);
          }
        })
        .catch((errorResponse) => {
          // Handle error...
          console.log('API responded with:', errorResponse);
        });
    },
    fetchVehicles(vehicleArray) {
      for(var i = 0; i < vehicleArray.length; i++){
        const vArr = vehicleArray[i].split('/');
        const vID = vArr[vArr.length - 2];
        starWarsResource.get(`vehicles/${vID}`)
          .then((response) => {
            this.vehicles.push(response.data);
          })
          .catch((err) => {
            console.log('Error returning vehicles: ', err);
        });
      }
    }
  }
});
