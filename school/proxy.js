			async function proxy(url/*e.g. https://raw.githubusercontent.com/*/){
				let response = await fetch(url + ((document.location.search == null || document.location.search == '' || document.location.search == '?') ? 'index.html' : `${document.location.search.replace(/^[\?]*/,'')}`));
				let html = await response.text();
				document.open();
				document.write();
				let css, match_spec;
				let match_groups = [];
				while ((match_spec = /<link[^>]*href=["']([^"':]*.css)["'][^>]*>/igm.exec(html)) !== null) {
					let match = match_spec[0];
					let group = match_spec[1];
					match_groups.push(group);
					html = html.replace(match, '');
				}
				if (!/<html>/i.test(html))
					html = "<html>" + html + "</html>";
				if (!/<head>/i.test(html))
					html = `<head><base href="${url}"></head>`;
				else
					html = html.replace(/<head>/i,`<head><base href="${url}">`);
				const _this = document.location.href.split("?")[0];
				html = html.replace(/(<a[^>]+href=['"])([^'":]*['"][^>]*>)/igm, '$1'+`${_this}?`+'$2');
				document.write(html);
				document.close();
				const head = document.getElementsByTagName('head')[0];
				const styleElem = document.createElement('style');
				styleElem.type = 'text/css';
				for (let group of match_groups)
				{
					response = await fetch(url + group);
					css = await response.text();
					styleElem.appendChild(document.createTextNode(css));
				}
				head.insertBefore(styleElem, head.firstChild);
			}
