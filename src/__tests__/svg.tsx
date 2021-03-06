/** @jsx createElement */
import {createElement} from "../index";
import {renderer} from "../dom";

// TODO: jsdom doesn’t seem to export the entire SVG class hierarchy so these
// tests are going to be mostly incomplete for now
// https://github.com/jsdom/jsdom/issues/2128
describe("render", () => {
	afterEach(() => {
		document.body.innerHTML = "";
		renderer.render(null, document.body);
	});

	test("simple", () => {
		renderer.render(<svg>Hello world</svg>, document.body);
		expect(document.body.firstChild).toBeInstanceOf(SVGElement);
		expect(document.body.firstChild!.firstChild).toBeInstanceOf(Text);
		expect(document.body.firstChild!.firstChild!.nodeValue).toEqual(
			"Hello world",
		);
	});

	test("mdn example", () => {
		renderer.render(
			<svg
				version="1.1"
				baseProfile="full"
				width="300"
				height="200"
				xmlns="http://www.w3.org/2000/svg"
			>
				<rect width="100%" height="100%" fill="red" />
				<circle cx="150" cy="100" r="80" fill="green" />
				<text x="150" y="125" font-size="60" text-anchor="middle" fill="white">
					SVG
				</text>
			</svg>,
			document.body,
		);
		expect(document.body.firstChild).toBeInstanceOf(SVGElement);
		for (const child of Array.from(document.body.firstChild!.childNodes)) {
			expect(child).toBeInstanceOf(SVGElement);
		}
	});

	test("foreignObject", () => {
		renderer.render(
			<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
				<foreignObject x="20" y="20" width="160" height="160">
					<div xmlns="http://www.w3.org/1999/xhtml">
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis
						mollis mi ut ultricies. Nullam magna ipsum, porta vel dui convallis,
						rutrum imperdiet eros. Aliquam erat volutpat.
					</div>
				</foreignObject>
			</svg>,
			document.body,
		);
		expect(document.body.firstChild).toBeInstanceOf(SVGElement);
		expect(document.body.firstChild!.firstChild!.firstChild).toBeInstanceOf(
			HTMLElement,
		);
	});

	test("classes", () => {
		renderer.render(
			<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
				<rect class="rectClass" x="10" y="10" width="100" height="100" />
				<circle class="circleClass" cx="40" cy="50" r="26" />
			</svg>,
			document.body,
		);

		const rect = document.body.firstChild!.firstChild!;
		const circle = rect.nextSibling;
		expect(rect).toBeInstanceOf(SVGElement);
		expect(circle).toBeInstanceOf(SVGElement);
		expect((rect as SVGElement).getAttribute("class")).toBe("rectClass");
		expect((circle as SVGElement).getAttribute("class")).toBe("circleClass");
	});
});
