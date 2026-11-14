<script>
	import { pageUrl } from "$lib/paging";
	import TutorialPage from "$lib/ui/tutorial_page.svelte";
	import SchemaEditor from "$lib/editor/SchemaEditor.svelte";
	import Code from "$lib/editor/Code.svelte";

	const hello = `/// Someone to greet.
struct Person {
    name: string
}

/// Ask for a greeting, get one back.
protocol Greeter {
    /// Returns "Hello, <name>!".
    function greet(who: Person) -> string;
}
`;
</script>


<TutorialPage previous_url={pageUrl("p2")} next_url={pageUrl("p2-s2")}>
	<h2>Your first schema</h2>
	<p>
		A schema describes the data two programs exchange and the calls one makes on the other. The one
		in the editor has a <Code src="struct" />, <Code src="Person" />, and a <Code src="protocol" />,
		<Code src="Greeter" />, with one function that takes a person and returns a string.
	</p>
	<p>
		Press <b>Compile</b> to turn it into code. Switch between Rust and TypeScript to see the same
		schema in each.
	</p>

	<h3>Try it</h3>
	<ul>
		<li>Add a field <Code src="age: u8" /> to <Code src="Person" />, and compile again.</li>
		<li>
			Misspell <Code src="string" />. The editor underlines the mistake straight away, and Compile
			lists it.
		</li>
		<li>Hover over a name to see what it is, or start typing a type to get suggestions.</li>
	</ul>

	<SchemaEditor slot="workspace" file="hello.ids" source={hello} />
</TutorialPage>
