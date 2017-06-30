<script>
	/**
	List Item Link
	*/
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
			act: [Function],
			drawer: [Object],
			drawer_mode: {
				type: String,
				default: 'INSTANT'
			}
		},
		components: {QItem, QItemSide, QItemMain},
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
				if (drawer) {
					// if drawer is provided we have three ways to deal with it:

					// a) close it immediately (WITHOUT animation) and perform an action
					if (this.drawer_mode === 'INSTANT') {
						if (drawer.active === true) {
							// now its the only way to avoid animation
							drawer.active = false;
							drawer.opened = false;
							drawer.backPosition = 0;
							drawer.nodePosition = -280;
						}
						action();
					}

					// b) close it normally (WITH animation), THEN WHEN ITS DONE perform an action
					else if (this.drawer_mode === 'AFTERCLOSE') {
						drawer.setState(false, action);
					}

					// c) close it normally (WITH animation), AND perform an action
					else {
						drawer.setState(false);						
						action();
					}
				}
				else {
					action();
				}
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
