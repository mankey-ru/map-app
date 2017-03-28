<script>
	import mixins from './../vue-mixins.js'

	export default {
		name: 'AppRoot',
		data: function () {
			return {
				auth: {
					email: '',
					password: '',
					pending: false
				}
			}
		},
		mixins: [mixins],
		mounted: function(){
			console.log('mnt')
			this.$on('submit', function(){
				console.log(arguments)
			})
		}
	}
</script>


<template>
	<div style="height:100%">

		<f7-statusbar></f7-statusbar>

		<!---------------------------------------------------------------------------------------
			Left panel 
		-->
		<f7-panel left reveal layout="dark">
			<f7-view id="left-panel-view" navbar-through :dynamic-navbar="true">
				<f7-navbar v-if="$theme.ios" title="Left Panel" sliding></f7-navbar>
				<f7-pages>
					<f7-page>
						<f7-navbar v-if="$theme.material" title="Left Panel" sliding></f7-navbar>
						<f7-block inner>
							<p>Left panel content goes here</p>
						</f7-block>
						<f7-block-title>Load page in panel</f7-block-title>
						<f7-list>
							<f7-list-item link="/about/" title="About">
								in sidebar
							</f7-list-item>
							<f7-list-item link="/about/" title="About" link-view="#main-view" link-close-panel>
								in main view
							</f7-list-item>
						</f7-list>
					</f7-page>
				</f7-pages>
			</f7-view>
		</f7-panel>
		<!---------------------------------------------------------------------------------------
			Right Panel
		-->
		<f7-panel right cover layout="dark">
			<f7-view id="right-panel-view" navbar-through :dynamic-navbar="true">
				<f7-navbar v-if="$theme.ios" title="Right Panel" sliding></f7-navbar>
				<f7-pages>
					<f7-page>
						<f7-navbar v-if="$theme.material" title="Right Panel" sliding></f7-navbar>
						<f7-block>
							<p>Right panel content goes here</p>
						</f7-block>
					</f7-page>
				</f7-pages>
			</f7-view>
		</f7-panel>
		<!---------------------------------------------------------------------------------------
			Main view
		-->
		<f7-views>
			<f7-view id="main-view" navbar-through :dynamic-navbar="true" main>
				<f7-navbar v-if="$theme.ios"><!-- iOS Theme Navbar -->
					<f7-nav-left>
						<f7-link icon="icon-bars" open-panel="left"></f7-link>
					</f7-nav-left>
					<f7-nav-center sliding>Mapp2</f7-nav-center>
					<f7-nav-right>
						<f7-link icon="icon-bars" open-panel="right"></f7-link>
					</f7-nav-right>
				</f7-navbar>
				<f7-pages>
					<f7-page>
						<f7-navbar v-if="$theme.material"><!-- Material Theme Navbar -->
							<f7-nav-left>
								<f7-link icon="icon-bars" open-panel="left"></f7-link>
							</f7-nav-left>
							<f7-nav-center sliding>Mapp1</f7-nav-center>
							<f7-nav-right>
								<f7-link icon="icon-bars" open-panel="right"></f7-link>
							</f7-nav-right>
						</f7-navbar>

						<f7-block-title>Welcome to my App</f7-block-title>
						<f7-block inner>
							<p>Duis sed erat ac eros ultrices pharetra id ut tellus. Praesent rhoncus enim ornare ipsum aliquet ultricies. Pellentesque sodales erat quis elementum sagittis.</p>
						</f7-block>
						<f7-list>
							<f7-list-item link="/about/" title="About"></f7-list-item>
						</f7-list>
						<f7-block>
							<f7-grid>
								<f7-col width="33">
									<f7-button open-popup="#popup">Popup</f7-button>
								</f7-col>
								<f7-col width="33">
									<f7-button open-login-screen="#login-screen">Войти</f7-button>
								</f7-col>
								<f7-col width="33">
									<f7-button href="/main/">Main</f7-button>
								</f7-col>
							</f7-grid>
						</f7-block>
						<f7-block-title>Modals</f7-block-title>
					</f7-page>
				</f7-pages>
			</f7-view>
		</f7-views>
		<!---------------------------------------------------------------------------------------
			Main view
		-->


		<!-- Popup -->
		<f7-popup id="popup">
			<f7-view navbar-fixed>
				<f7-pages>
					<f7-page>
						<f7-navbar title="Popup">
							<f7-nav-right>
								<f7-link close-popup>Close</f7-link>
							</f7-nav-right>
						</f7-navbar>
						<f7-block>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Neque, architecto. Cupiditate laudantium rem nesciunt numquam, ipsam. Voluptates omnis, a inventore atque ratione aliquam. Omnis iusto nemo quos ullam obcaecati, quod.</f7-block>
						<f7-buttons>
							<f7-button big color="red">Button 1</f7-button>
							<f7-button round color="green">Button 2</f7-button>
							<f7-button raised>Button 3</f7-button>
						</f7-buttons>
					</f7-page>
				</f7-pages>
			</f7-view>
		</f7-popup>

		<!-- Login Screen -->
		<f7-login-screen id="login-screen">
			<f7-view navbar-fixed>
				<f7-pages>
					<f7-page login-screen>
						<f7-login-screen-title>
							Вход
						</f7-login-screen-title>
						<form v-on:submit="LOG_IN">
							<f7-list>
								<f7-list-item>
									<f7-label>Email</f7-label>
									<f7-input v-model="auth.email" placeholder="vasya@pupkin.ru" type="text"></f7-input>
								</f7-list-item>
								<f7-list-item>
									<f7-label>Пароль</f7-label>
									<f7-input v-model="auth.password" placeholder="********" type="password"></f7-input>
								</f7-list-item>
								<f7-list-item>
									<f7-buttons>
										<f7-button>Регистрация</f7-button>
										<f7-button>Напомнить</f7-button>
										<f7-button  v-on:click="LOG_IN" v-bind:disabled="auth.pending" color="white" bg="green">Войти</f7-button>
									</f7-buttons>
								</f7-list-item>
							</f7-list>
						</form>
						<f7-list>
							<f7-list-button close-login-screen>
								Вернуться
							</f7-list-button>
						</f7-list>
					</f7-page>
				</f7-pages>
			</f7-view>
		</f7-login-screen>

	</div>
</template>



<style></style>

