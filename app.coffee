ios = require "ios-kit"

page = new PageComponent
  width: Screen.width
  height: Screen.height
  scrollHorizontal: false 
  scrollVertical: false

statusBar = new ios.StatusBar
	carrier:"Free"
	network:"LTE"
	battery: 42
	
loadingScreen = new Layer
	width: page.width
	height: page.height
	parent: page.content
	backgroundColor: "white"
	
# Utiliser ca pour les pages qui scrollent
# mainScreenScroll = new ScrollComponent
#   width: Screen.width
#   height: Screen.height
#   parent: mainScreen
#   scrollHorizontal: false	
