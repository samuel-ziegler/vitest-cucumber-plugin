tag my-app
	text = "Hello World!"
	def onClick
		log "clicked"
		text = 'Button pressed!'
	def render
		log "render"
		<self>
			<.text> text
			
			<button @click=onClick> "push me!"