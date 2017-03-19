{ViewNavigationController} = require "ViewNavigationController"

Screen.backgroundColor = "white"

vnc = new ViewNavigationController

# This is optional, but allows you to customize the transition
vnc.animationOptions =
	curve: "ease"
	time: .9
	

# # # # # # # # # # # # # # # # # # # # # # # #
# VIEWS
# # # # # # # # # # # # # # # # # # # # # # # #
mainScreen = new Layer
	name: "initialView"
	width: Screen.width
	height: Screen.height
	image: "images/mainScreen.png"
	parent: vnc

viewHome = new ScrollComponent
	width: Screen.width
	height: Screen.height
	backgroundColor: "white"
	scrollHorizontal: false
	parent: vnc
	
viewProfile = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "white"
	image: "images/profileView.png"
	parent: vnc
	
viewHistoric = new Layer
	width: Screen.width
	height: Screen.height
	backgroundColor: "white"
	image: "images/historicView.png"
	parent: vnc
	
# # # # # # # # # # # # # # # # # # # # # # # #
# TEXT
# # # # # # # # # # # # # # # # # # # # # # # #
signinButton = new Layer
	html: "<span style='font-size: 35px'>Sign In</span>"
	y: Screen.height - 100
	fontSize: 40
	style:
		"font-weight": "bold"
	parent: mainScreen
	backgroundColor: "rgba(0, 0, 0, 0)"
	x: 237
	
pipe = new Layer
	html: "<span style='font-size: 35px'>|</span>"
	y: Screen.height - 100
	fontSize: 40
	style:
		"font-weight": "bold"
	parent: mainScreen
	backgroundColor: "rgba(0, 0, 0, 0)"
	x: 374
	
registerButton = new Layer
	html: "<span style='font-size: 35px'>Register</span>"
	y: Screen.height - 100
	fontSize: 40
	style:
		"font-weight": "bold"
	parent: mainScreen
	backgroundColor: "rgba(0, 0, 0, 0)"
	x: 399
	
profileButton = new Layer
	parent: viewHome
	html: "HOME"
	y: Screen.height - 200
	backgroundColor: "red"
	width: 270
	style:
		"background-color": "transparent"
		"color": "transparent"

homeButton = new Layer
	parent: viewProfile
	html: "PROFILE"
	y: Screen.height - 200
	backgroundColor: "red"
	width: 270
	x: 220
	style:
		"background-color": "transparent"
		"color": "transparent"
		
historicButton = new Layer
	parent: viewProfile
	html: "HISTORIC"
	y: Screen.height - 200
	backgroundColor: "red"
	width: 270
	x: 420
	style:
		"background-color": "transparent"
		"color": "transparent"
	
# # # # # # # # # # # # # # # # # # # # # # # #
# TABBARS
# # # # # # # # # # # # # # # # # # # # # # # #
homeTabBar = new Layer
	style:
		"position": "fixed"
		"padding-top": 0
	image: "images/homeTabBar.png"
	y: Screen.height - 101
	parent: viewHome
	backgroundColor: "rgba(229, 229, 229, .95)"
	width: Screen.width
	height: 100
	
profileTabBar = new Layer
	image: "images/profileTabBar.png"
	style:
		"position": "fixed"
		"padding-top": 0
	y: Screen.height - 101
	parent: viewProfile
	backgroundColor: "rgba(229, 229, 229, .95)"
	width: Screen.width
	height: 100
	
historicTabBar = new Layer
	image: "images/historicTabBar.png"
	style:
		"position": "fixed"
		"padding-top": 0
	y: Screen.height - 101
	parent: viewHistoric
	backgroundColor: "rgba(229, 229, 229, .95)"
	width: Screen.width
	height: 100
	
homeStatusBar = new Layer
	parent: viewHome
	image: "images/homeStatusBar.png"
	width: Screen.width
	height: 33
	y: 0
	backgroundColor: "rgba(250, 250, 250, .9)"
	
profileStatusBar = new Layer
	parent: viewProfile
	image: "images/homeStatusBar.png"
	width: Screen.width
	height: 33
	y: 0
	backgroundColor: "rgba(250, 250, 250, .9)"
	
historicStatusBar = new Layer
	parent: viewHistoric
	image: "images/homeStatusBar.png"
	width: Screen.width
	height: 33
	y: 0
	backgroundColor: "rgba(250, 250, 250, .9)"
	
# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
historicButton.onTap ->
	vnc.transition viewHistoric, speed = 0

profileButton.onTap ->
	vnc.transition viewProfile, speed = 0
	
homeButton.onTap ->
	vnc.transition viewHome, speed = 0

signinButton.onTap ->
	vnc.transition viewHome, direction = "up"

# # # # # # # # # # # # # # # # # # # # # # # #
# RECOMMENDEDS
# # # # # # # # # # # # # # # # # # # # # # # #
homeRecommended = new Layer
	y: 220
	x: 35
	width: 680
	height: 265
	image: "images/Recommended1.png"
	parent: viewHome.content
	
historicGroup = new Layer
	y: 550
	x: 35
	width: 680
	height: 1230
	image: "images/historicGroup.png"
	parent: viewHome.content

# To remove the back button from a view, do this:
# vnc.removeBackButton(viewUpdate)

# # # # # # # # # # # # # # # # # # # # # # # #
# TOPBARS
# # # # # # # # # # # # # # # # # # # # # # # #
historicTopBar = new Layer
	width: Screen.width
	image: "images/TopBar1.png"
	y: 32
	height: 150
	parent: viewHome

# # # # # # # # # # # # # # # # # # # # # # # #
# EVENTS
# # # # # # # # # # # # # # # # # # # # # # # #
# btnGeneral.on Events.Click, ->
# 	vnc.transition viewGeneral
# 	
# btnSiri.on Events.Click, ->
# 	vnc.transition viewSiri
# 
# btnUpdate.on Events.Click, ->
# 	vnc.transition viewUpdate

###
To change the direction of the transition,
just add a "direction" property.

Example:
btnUpdate.on Events.Click, ->
	vnc.transition viewUpdate, direction = "up"

The transitions available are:
"up", "down", "left" and "right"
###