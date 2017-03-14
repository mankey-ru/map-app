<script>
	var apiUrl = require('./../api-url.js')
	// try https://www.npmjs.com/package/vue-material-datepicker
	import Datepicker from 'vuejs-datepicker'
	import _ from 'lodash'
	import mixins from './../vue-mixins.js'
	import mapLib from './../map-lib.js'
	import request from 'superagent'
	import miniToastr from 'mini-toastr'

	import VueOffcanvas from './vue-offcanvas.vue' 

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
				datepicker_visible: false,
				sidebar_visible: false,
				genres_visible: false
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
			Datepicker,
			VueOffcanvas
		},
		mounted: function () {
			_vm = this;

			var sidebar = document.querySelector('.side-wrap');
			document.body.addEventListener('click', (evt)=>{
				if (this.sidebar_visible===true && sidebar.contains(event.target)===false) {
					this.sidebar_visible = false;
				}
			})
			document.body.addEventListener('keyup', (evt)=>{
				if (evt.keyCode===27) {
					this.sidebar_visible = false;
				}
			})

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
	import './../../node_modules/hamburgers/dist/hamburgers.min.css' // TODO use particular single type
</script>

<template>
	<!-- TODO use https://www.npmjs.com/package/v-media-query instead of bootstrap media queries like visible-xs -->
	<div>
		<div v-show="map_pending" class="text-center">
			<i class="spin spin-lg spin-global"></i>
		</div>

		<div v-show="!map_pending">
			<div class="hdn">
				<!-- positions explained: https://google-developers.appspot.com/maps/documentation/javascript/examples/full/control-positioning-labels -->
				<div data-pos="TOP" class="j-mapctrl" style="width: 100%; ">

				<div class="side-wrap" v-bind:class="sidebar_visible?'side-wrap-visible':''">
						<div class="side-content">
							<h1 class="text-center">Меню</h1>
							<br/><br/>
							<a v-on:click="GOTO_LOGIN" class="btn btn-block btn-primary btn-lg">
								Вход
							</a>
							<a v-on:click="GOTO_REGISTER" class="btn btn-block btn-default btn-lg">
								Регистрация
							</a>
							<hr />
							<a v-on:click="GOTO_PROFILE" class="btn btn-block btn-default btn-lg">
								Профиль
							</a>
							<a v-on:click="GOTO_PROFILE" class="btn btn-block btn-default btn-lg">
								Мои мероприятия
							</a>
							<hr />
							<a v-on:click="GOTO_REGISTER" class="btn btn-block btn-default btn-lg">
								Как это работает
							</a>
							<a v-on:click="GOTO_REGISTER" class="btn btn-block btn-default btn-lg">
								О нас
							</a>
						</div>
					</div>
					<div class="map-ctrl-wrap">
						
					
					<div class="row">
						<div class="col-md-18 col-sm-10 col-xs-8">
							<form v-on:submit.prevent="evtSearch">
								<div class="map-pane-main">
									<!-- <i v-on:click="sidebar_visible = !sidebar_visible" class="glyphicon glyphicon-menu-hamburger" ></i>  -->
									<a 
									v-on:click.stop="sidebar_visible = !sidebar_visible;" 
									class="hamburger hamburger--arrow" 
									v-bind:class="sidebar_visible?'is-active':''">
									<span class="hamburger-box">
										<span class="hamburger-inner"></span>
									</span></a>
									<span class="hidden-xs hidden-sm">
										<input v-model="search.text" />
										<i class="glyphicon glyphicon-search" v-on:click="evtSearch"></i>
										<i class="glyphicon glyphicon-tasks"></i>
									</span>
								</div>
								<div class="map-pane__wrap">
									<span class="hidden-xs hidden-sm">
										<div class="map-pane__content map-pane-date" v-on:click="datepicker_visible = !datepicker_visible">
											<span>{{search.date | dateFormatPretty}}</span> 
											<i class="glyphicon glyphicon-calendar"></i>
										</div>
									</span>
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
						<div class="col-md-6 col-sm-14 col-xs-16">
							<div class="text-right">
								<div class="visible-xs visible-sm">
									<a class="btn btn-default btn-lg btn-map-standalone">
										<i class="glyphicon glyphicon-calendar"></i>
									</a>
									<div style="margin-top:1em">
										<a class="btn btn-default btn-lg btn-map-standalone">
											<i class="glyphicon glyphicon-search" v-on:click="evtSearch"></i>
										</a>
									</div>
								</div>
								<div class="hidden-xs hidden-sm">
									<i v-if="currentUser"  v-on:click.prevent="GOTO_PROFILE" class="glyphicon glyphicon-user map-profile-icon"></i>
									<div v-if="!currentUser">
										<a class="btn btn-default btn-map-standalone" v-on:click="GOTO_LOGIN">
											Вход
										</a> &#160;
										<a class="btn btn-default btn-map-standalone" v-on:click="GOTO_REGISTER">
											Регистрация
										</a>
									</div>
								</div>
							</div>
						</div>
					</div>
					</div>
				</div>
				<div data-pos="BOTTOM_CENTER" class="j-mapctrl map-ctrl-wrap">
					<div class="11111genre-teaser">
						<a v-on:click="genres_visible = !genres_visible" class="btn btn-lg btn-default">Фильтр по жанрам</a>
						<div v-show="genres_visible" class="map-pane__content">
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
				</div>
				<div data-pos="RIGHT_BOTTOM" class="j-mapctrl map-ctrl-wrap">
					<a v-if="currentUser.role" v-on:click="gotoEventNew" class="btn btn-warning btn-lg hidden-xs btn-map-standalone" style="margin:3em">
						Создать мероприятие
					</a>
					<a v-if="currentUser.role" v-on:click="gotoEventNew" class="btn btn-warning visible-sm-inline-block btn-material">+</a>
					<!-- <input id="map-ctrl-search" class="form-control" style="width: 20em" placeholder="Поиск мест" /> -->
				</div>
			</div>
			<div id="map-container" class="__fullscreen" v-bind:class="sidebar_visible?'map-when-sidebar':''"></div>
		</div>

	</div>
</template>

<style scoped lang="less">
	.-boxshad {
		box-shadow: #000 1px 2px 4px 0px;
	}
	.-map-pane-fontsize {
		font-size: 2.4em;
	}
	.map-profile-icon {
		font-size:4em;
		margin-right:.5em;
		cursor: pointer;
	}
	.btn-map-standalone {
		.-boxshad();
		.-map-pane-fontsize();
	}
	.hamburger {
		padding: 0;
	}
	.side-wrap {
		margin-left:-300px;
		position: fixed;
		height: 100vh;
		width: 300px;
		overflow: hidden;
		background-color: #fff;
		transition: transform .2s ease-in-out;
		transform: translateX(0);
	}
	.side-wrap-visible {
		transform: translateX(300px);
		box-shadow: rgba(0,0,0,0.8) 0px 0px 0px 9999px;
		//transition: width .2s ease-in-out;
		//display: block; 
	}
	.side-content {
		padding: 1em;
	}
	.map-pane__wrap {
		float:left;
	}
	.map-pane__content {
		.-boxshad();
		.-map-pane-fontsize();
		border-radius: 3px;
		background: #fff;
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
			width:15em;
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