<script>
	var apiUrl = require('./../api-url.js')
	// try https://www.npmjs.com/package/vue-material-datepicker
	import Datepicker from 'vuejs-datepicker'
	import _ from 'lodash'
	import mixins from './../vue-mixins.js'
	import mapLib from './../map-lib.js'
	import request from 'superagent'
	import miniToastr from 'mini-toastr'

	var _vm;
	var map;

	export default {
		name: 'start',
		data: function () {
			return {
				search: {
					date: new Date(2016, 9, 16),
					text: ''
				},
				map_pending: true,
				datepicker_visible: false
			}
		},
		methods: {
			genresCheckAll: function (boo) {
				boo = !!boo;
				for (let gen of this.genreList) {
					gen.selected = !!boo;
				}
			},
			evtSearch: function () {
				alert(JSON.stringify(this.$data.search, null, 2))
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

				request
				.get(apiUrl + 'events')
				.end((err,res)=>{
					if (err) {
						miniToastr.error(err || 'Failed to get events')
					}
					else {
						if (res.body instanceof Array) {

							for (let evt of res.body) {
								new google.maps.Marker({
									position: {lat: evt.latLng[0], lng: evt.latLng[1]},
									map: map
										//animation: google.maps.Animation.DROP
									})
							}
						}
					}
				})

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
		<div v-show="map_pending" class="text-center">
			<i class="spin spin-lg spin-global"></i>
		</div>

		<div v-show="!map_pending">
			<div class="hdn">
				<div data-pos="TOP_LEFT" class="map-ctrl-wrap" style="width: 100%; ">
					<div class="row">
						<div class="col-md-18">
							<form v-on:submit.prevent="evtSearch">
								<div class="map-pane-main">
									<i class="glyphicon glyphicon-menu-hamburger" ></i>
									<input v-model="search.text" />
									<i class="glyphicon glyphicon-search" v-on:click="evtSearch"></i>
									<i class="glyphicon glyphicon-tasks"></i>
								</div>
								<div class="map-pane__wrap">
									<div class="map-pane__content map-pane-date" v-on:click="datepicker_visible = !datepicker_visible">
										<span>{{search.date | dateFormatPretty}}</span> 
										<i class="glyphicon glyphicon-calendar"></i>
									</div>
									<div class="map-pane__content" v-show="datepicker_visible">
										<div class="__datepicker-wrap __datepicker-wrap-noborder">
											<datepicker 
											:input-class="'form-control'" 
											v-model="search.date"
											:language="'ru'"
											:monday-first="true"
											:format="'dd.MM.yyyy'"
											:inline="true"
											></datepicker>
										</div>
									</div>
								</div>
							</form>
						</div>
						<div class="col-md-6">
							<div class="text-right">
								<i v-if="currentUser"  v-on:click.prevent="gotoProfile" class="glyphicon glyphicon-user" style="font-size:4em;margin-right: .5em;cursor: pointer;"></i>
								<div v-if="!currentUser">
									<button v-on:click.prevent="GOTO_LOGIN" class="btn btn-default btn-lg boxshad">
										Вход
									</button> &#160;
									<button class="btn btn-default btn-lg boxshad" v-on:click.prevent="gotoRegister" type="button">
										Регистрация
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div data-pos="BOTTOM_CENTER" class="map-ctrl-wrap">
					<div class="11111genre-teaser">
						<a class="btn btn-lg btn-default">Фильтр по жанрам</a>
						<div>
							<a v-on:click="genresCheckAll(1)" class="link-dotted">Все</a> &#160;
							<a v-on:click="genresCheckAll(0)" class="link-dotted">Ничего</a>
						</div>
						<div>
							<label v-for="gen in genreList" class="genre btn btn-default" v-bind:class="gen.selected?'active':''">
								<input type="checkbox" v-model="gen.selected" />
								<span>{{gen.name}}</span>
							</label>
						</div>
					</div>
				</div>
				<div data-pos="BOTTOM_RIGHT" class="map-ctrl-wrap">
					<a v-if="currentUser.role" v-on:click="gotoEventNew" class="btn btn-warning hidden-xs">
						Создать мероприятие
					</a>
					<a v-if="currentUser.role" v-on:click="gotoEventNew" class="btn btn-warning visible-xs-inline-block btn-material">+</a>
					<!-- <a v-if="currentUser.role" v-on:click="gotoEventNew" class="btn btn-primary visible-xs-inline-block btn-material">+</a> -->
					<!-- <input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" /> -->
				</div>
			</div>
			<div id="map-container"></div>
		</div>

	</div>
</template>

<style scoped lang="less">
	#map-container {
		position: absolute;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		bottom:0;
		right: 0;
	}
	.boxshad {
		box-shadow: #000 1px 2px 4px 0px;
	}
	.map-pane__wrap {
		float:left;
	}
	.map-pane__content {
		.boxshad();
		border-radius: 3px;
		background: #fff;
		font-size: 2em;
		padding: .4em .6em;
	}
	.map-pane-date {
		cursor:pointer;
		display: inline-block;
		margin-bottom: .5em;
	}
	.map-pane-main {
		.map-pane__wrap();
		.map-pane__content();
		margin-right: .5em;
		input{
			margin-left: 1em;
			border: none;
			width:20em;
		}
		input:focus{
			outline: 0;
		}
		.glyphicon{
			cursor: pointer;
		}
		.glyphicon-search{
			padding-right: .5em;
			border-right: 1px solid #bdbdbd;
			margin-right: .3em;
		}
	}
	.genre {
		cursor: pointer;
		margin-top: .1em;
		margin-right: 1em;
		font-weight: normal;
		font-size: 1em;
		opacity: .7;
		&.active {
			opacity: 1;
		}
		&>input {
			display: none;
		}
	}
	.genre-teaser { // лапоть внизу
		border-bottom: 50px solid #000;
		border-left: 50px solid transparent;
		border-right: 50px solid transparent;
		height: 0;
		width: 200px;
		line-height: 2.5em;
		font-size: 2em;
		text-align: center;
	}
</style>