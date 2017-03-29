<script>
	/**
	List Item Link
	Simple replacement for DrawerLink.vue from Quasar Framework
	with non-ligature based icons from https://www.npmjs.com/package/mdi
	*/
	export default {
		props: {
			icon: String,
			to: { // name of target page
				type: [Object, String]
			},
			act: {
				type: [Function]
			},
			delay: {
				type: [Boolean]
			}
		},
		methods: {
			GOTO: function(){
				var vm = this.$router;
				if (!this.act && !this.to) {
					console.error('List Item Link: required props (act|to) not provided')
					return
				}				
				var toObj = {name: this.to};
				var action = this.act || function(){
					vm.push(toObj)
				};
				var drawer = this.$parent; // drawer could be provided via prop maybe
				if (drawer && drawer.setState) {
					if (this.delay) {
						drawer.setState(false, action)
					}
					else {
						action();
						drawer.setState(false);
					}
				}
				else {
					action
				}
			}
		}
	};
</script>

<template>
	<div class="item item-link" v-on:click="GOTO">
		<i v-if="icon" class="item-primary mdi" v-bind:class="'mdi-'+icon"></i>
		<div class="item-content">
			<slot></slot>
		</div>
	</div>
</template>

<style></style>
