import {Given,When,Then} from "vitest-cucumber-plugin"
import "../../src/my-app.imba"


Given("I have a test component") do(state, params, data) 
	document.body.innerHTML = ""
	imba.mount(<my-app>)
	state


Then('the test component text is {string}') do(state, [text], data)
	waitFor do expect(screen.getByText(text)).toBeTruthy!
	state
When("I push the button") do(state, params, data)
	const button = screen.getByText("push me!")
	button.click!
	state