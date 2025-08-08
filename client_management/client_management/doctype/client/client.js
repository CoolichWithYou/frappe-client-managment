// Copyright (c) 2025, meattree0 and contributors
// For license information, please see license.txt


frappe.ui.form.on("Client", {
	onload_post_render(frm) {
		frm.add_custom_button('Получить адрес', () => {
			if (!frm.doc.inn) {
				frappe.msgprint('Введите ИНН для получения адреса');
				return;
			}
			frappe.call({
				doc: frm.doc,
				method: "get_address_by_inn",
				args: { inn: frm.doc.inn },
				callback: function (r) {
					if (r.message) {
						frm.set_value('address', r.message);
						frm.refresh_field('address');
						frappe.show_alert({ message: `Адрес успешно получен: ${r.message}`, indicator: 'green' });
						frappe.msgprint(`Адрес клиента: ${r.message}`);
					} else {
						frappe.msgprint('Адрес не найден');
					}
				}
			});
		});

		const inputs = document.getElementsByClassName('control-value');
		Array.from(inputs).forEach(el => {
			const observer = new MutationObserver(() => {
				const frappeControl = el.closest('.frappe-control');
				if (!frappeControl) return;

				const fieldname = frappeControl.getAttribute('data-fieldname');
				const value = el.textContent;

				if (frm.fields_dict[fieldname]) {
					frm.fields_dict[fieldname].$input.val(value);
				}
			});
			observer.observe(el, { characterData: true, childList: true, subtree: true });
		});

		const fields = {
			'name1': { method: 'get_by_name', argName: 'company_name' },
			'inn': { method: 'get_by_inn', argName: 'company_name' },
			'kpp': { method: 'get_by_kpp', argName: 'company_name' },
		};

		function setupFieldListener(fieldName, method, argName) {
			const $input = frm.fields_dict[fieldName].$wrapper.find('input');
			if (!$input.length) return;

			$input.on('input', frappe.utils.debounce(() => {
				const txt = $input.val();
				if (!txt) return;

				frappe.call({
					doc: frm.doc,
					method: method,
					args: { [argName]: txt },
					callback: function (r) {
						if (r.message) {
							frm.fields_dict[fieldName].set_data(r.message);
						}
					}
				});
			}, 300));
		}

		Object.entries(fields).forEach(([fieldName, { method, argName }]) => {
			setupFieldListener(fieldName, method, argName);
		});
	}
});



