<script>
	// try https://www.npmjs.com/package/vue-material-datepicker
	import Datepicker from 'vuejs-datepicker';
	import _ from 'lodash';
	import mixins from './../vue-mixins.js';
	import notie from 'notie';
	import mapLib from './../map-lib.js'; 

	var _vm;
	var map;

	export default {
		name: 'start',
		data: function () {
			return {
				textSearch: '',
				date: new Date(2016, 9, 16),
				map_pending: true
			}
		},
		methods: {
			genresCheckAll: function (boo) {
				boo = !!boo;
				for (let gen of this.genreList) {
					gen.selected = !!boo;
				}
			},
			submit: function () {
				alert(JSON.stringify(this.$data, null, 2))
			}
		},
		mixins: [mixins],
		components: {
			Datepicker
		},
		mounted: function () {
			_vm = this;
			mapLib.create((createdMap)=>{
				this.map_pending = false;
				map = createdMap;
			});
		},
		computed: {
			genreList: function(){
				return this.$root.$data.genreList
			}
		}
	}
</script>

<template>

	<div>
		<h1>{{map_pending}}</h1>
		<div class="well">
			<div class="row form-group">
				<div class="col-md-7 col-xs-24">
					<label>Название</label>
					<input v-model="textSearch" class="form-control" />
				</div>
				<div class="col-md-10 col-xs-24">
					<div>
						<label>Жанры</label> 
						&#160;&#160;&#160;
						<a v-on:click="genresCheckAll(1)" class="link-dotted">Все</a> &#160;
						<a v-on:click="genresCheckAll(0)" class="link-dotted">Ничего</a>
					</div>
					<div>
						<label v-for="gen in genreList" class="genre btn btn-default" v-bind:class="gen.selected?'active':''">
							<input type="checkbox" v-model="gen.selected" />
							<span>{{gen.name}}</span>
						</label>
						<span class=""></span>
					</div>
				</div>
				<div class="col-md-4 col-xs-12" v-bind:class="{'datepicker__date-empty': !date}">
					<label>Дата</label>
					<div class="__datepicker-wrap">
						<datepicker 
						:input-class="'form-control'" 
						v-model="date"
						:language="'ru'"
						:monday-first="true"
						:format="'dd.MM.yyyy'"
						></datepicker>
						<i class="__datepicker-clear" v-on:click="date=null">
							<i class="glyphicon glyphicon-remove"></i>
						</i>
					</div>
				</div>
				<div class="col-md-3 col-xs-12">
					<label>&#160;</label>
					<a class="btn btn-primary btn-block" v-on:click="submit">Искать</a>
				</div>
			</div>
		</div>

		<div v-show="map_pending" class="text-center">
			<i class="spin spin-lg"></i>
		</div>

		<div v-show="!map_pending">
			<div class="hdn">
				<div data-pos="TOP_RIGHT" class="map-ctrl-wrap">
					<a v-on:click="gotoEventNew" class="btn btn-primary btn-lg">
						<i class="glyphicon glyphicon-plus"></i> Добавить событие
					</a>
				</div>
				<div data-pos="TOP_LEFT" class="map-ctrl-wrap">
					<input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" />
				</div>
			</div>
			<div id="map-container"></div>
		</div>

	</div>
</template>

<style scoped>
	#map-container {
		/*height: 600px;*/
	}
	.genre {
		cursor: pointer;
		margin-top: .1em;
		margin-right: 1em;
		font-weight: normal;
		font-size: 1em;
		opacity: .7;
	}
	.genre.active {
		opacity: 1;
	}
	.genre>input {
		display: none;
	}
</style>
