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
	image: "images/loadingPage.gif"
	

# separator = new TextLayer
# 	text: "The quick brown fox jumps over the lazy dog"
# 	color: "#aaa"
# 	textAlign: "center"
# 	fontSize: 14
# 	width: 220
# 	height: 40
# 	fontFamily: "Georgia"
# 
# separator.center()

signinButton = new ios.Button
	text:"Sign In"
	buttonType:"small"
	color:"#000"
	constraints:
		top: 600
		leading: 123

pipe = new ios.Text
	text:"|"
	fontSize:19
	top: 50
	constraints:
		top: 598
		leading: 183

registerButton = new ios.Button
	text:"Register"
	buttonType:"small"
	color:"#000"
	constraints:
		top: 600
		leading: 197

# Utiliser ca pour les pages qui scrollent
# mainScreenScroll = new ScrollComponent
#   width: Screen.width
#   height: Screen.height
#   parent: mainScreen
#   scrollHorizontal: false		
