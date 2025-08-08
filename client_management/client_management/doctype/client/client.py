# Copyright (c) 2025, meattree0 and contributors
# For license information, please see license.txt
import json

import frappe
from frappe.model.document import Document
from dadata import Dadata


class Client(Document):
	@property
	def token(self):
		return frappe.conf.get("token")

	def _get_suggestions(self, query):
		cache_key = f"dadata:suggest:party:{query}"

		cached = frappe.cache().get_value(cache_key)
		if cached:
			result = cached
		else:
			dadata = Dadata(self.token)
			result = dadata.suggest("party", query, count=3)

			if not result:
				return []

			frappe.cache().set_value(cache_key, result, expires_in_sec=3600)

		suggestions = []
		for item in result:
			data = item.get("data", {})
			label = f"{item['value']} — {data.get('inn', '')} / {data.get('kpp', '')}"
			suggestions.append({
				"label": label,
				"item": item,
				"data": data,
			})
		return suggestions

	@frappe.whitelist()
	def get_address_by_inn(self, inn):
		suggestions = self._get_suggestions(inn)
		if not suggestions:
			frappe.msgprint("По ИНН ничего не найдено")
			return ""

		address = suggestions[0]["data"].get("address", {}).get("value", "")
		return address

	@frappe.whitelist()
	def get_by_name(self, company_name):
		suggestions = self._get_suggestions(company_name)
		return [{
			"label": s["label"],
			"value": s["item"]["value"]
		} for s in suggestions]

	@frappe.whitelist()
	def get_by_inn(self, company_name):
		suggestions = self._get_suggestions(company_name)
		return [{
			"label": s["label"],
			"value": s["data"].get("inn", "")
		} for s in suggestions]

	@frappe.whitelist()
	def get_by_kpp(self, company_name):
		suggestions = self._get_suggestions(company_name)
		return [{
			"label": s["label"],
			"value": s["data"].get("kpp", "")
		} for s in suggestions]
