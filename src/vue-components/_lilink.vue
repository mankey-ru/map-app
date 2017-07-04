<script>
	/**
	List Item Link
	*/
	import mixins from './../vue-mixins.js'
	import {
		QItem,
		QItemSide,
		QItemMain,
		QIcon
	} from 'quasar'
	export default {
		props: {
			icon: String,
			label: String,
			sublabel: String,
			to: [Object, String],
			act: [Function]
		},
		components: {QItem, QItemSide, QItemMain},
		mixins: [mixins],
		methods: {
			_GOTO: function(){
				var vm = this.$router;
				if (!this.act && !this.to) {
					console.error('List Item Link: required props (act|to) not provided')
					return
				}
				var toObj = {name: this.to};
				var action = this.act || function(){
					vm.push(toObj)
				};
				var drawer = this.drawer; //  || this.$parent.$refs.drawer_left
				this.TOGGLESIDE();
				action();
			}
		},
		computed: {
			isCurrent: function(){
				return this.$route.name === this.to
			}	
		}
	};
</script>

<template>
	<q-item :active="isCurrent" :link="true" v-on:click="_GOTO">
		<q-item-side v-if="icon" v-bind:icon="icon" />
		<q-item-main v-bind:label="label" v-bind:sublabel="sublabel" />
	</q-item>
</template>

<style scoped>
</style>
