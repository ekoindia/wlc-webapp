export const processTransactionData = (tmp_lst) => {
	//This function intends to process transaction data
	let _tx_to_show_in_hist = [];
	let interaction_list = [];
	let role_tx_list = {};
	let len = tmp_lst ? tmp_lst.length : 0;
	let last_category = "";
	// let lastCategory;
	// let category_list;
	// let k, l, _lbl, m;
	// let processedData;
	// console.log("len", len);

	for (let i = 0; i < len; i++) {
		// Do not show, if it's a platform specific card
		// if (tmp_lst[i].platform_id == 1 && !this.isWebview)
		// {
		//   continue;
		// }

		// Add trxn to global role list
		role_tx_list[tmp_lst[i].id] = {
			order: i,
			label: tmp_lst[i].label_i18n || tmp_lst[i].label || "",
			// is_customer_visible: (tmp_lst[i].is_customer_visible || 0),
			is_visible: tmp_lst[i].is_visible || 0,
			behavior: tmp_lst[i].behavior || 0,
		};

		if ("group_interaction_links" in tmp_lst[i]) {
			role_tx_list[tmp_lst[i].id].group_interaction_links =
				tmp_lst[i].group_interaction_links;
		} else if ("group_interaction_ids" in tmp_lst[i]) {
			role_tx_list[tmp_lst[i].id].group_interaction_ids =
				tmp_lst[i].group_interaction_ids;
		}

		if ("icon" in tmp_lst[i]) {
			role_tx_list[tmp_lst[i].id].icon = tmp_lst[i].icon;
		}

		if ("ext_icon" in tmp_lst[i]) {
			role_tx_list[tmp_lst[i].id].ext_icon = tmp_lst[i].ext_icon;
		}

		if ("logo" in tmp_lst[i]) {
			role_tx_list[tmp_lst[i].id].logo = tmp_lst[i].logo;
		}

		if ("brand_category_ids" in tmp_lst[i]) {
			role_tx_list[tmp_lst[i].id].brand_category_ids =
				tmp_lst[i].brand_category_ids;
		}

		if (tmp_lst[i].imp == 1) {
			role_tx_list[tmp_lst[i].id].imp = 1;
		}

		if (tmp_lst[i].description) {
			role_tx_list[tmp_lst[i].id].desc = tmp_lst[i].description;
		}

		if (tmp_lst[i].help_media_urls) {
			role_tx_list[tmp_lst[i].id].media = tmp_lst[i].help_media_urls;
		}

		if ("earn" in tmp_lst[i] && tmp_lst[i].earn != "") {
			role_tx_list[tmp_lst[i].id].earn = tmp_lst[i].earn;
		}

		if (tmp_lst[i].beta == 1) {
			role_tx_list[tmp_lst[i].id].beta = tmp_lst[i].beta;
		}
		if (tmp_lst[i].uri) {
			role_tx_list[tmp_lst[i].id].uri = tmp_lst[i].uri;

			if (tmp_lst[i].uri_root_id > 0) {
				role_tx_list[tmp_lst[i].id].uri_root_id =
					tmp_lst[i].uri_root_id;
			}
		}

		if (tmp_lst[i].meta) {
			role_tx_list[tmp_lst[i].id].meta = tmp_lst[i].meta;
		}

		if (tmp_lst[i].crm_meta) {
			role_tx_list[tmp_lst[i].id].crm = tmp_lst[i].crm_meta;
		}

		// if (
		// 	"released_days_ago" in tmp_lst[i] &&
		// 	Math.abs(tmp_lst[i].released_days_ago) <=
		// 		this.show_new_badge_for_days
		// ) {
		// 	tmp_lst[i].new = true;
		// 	role_tx_list[tmp_lst[i].id].new = true;
		// } else {
		// 	tmp_lst[i].new = false;
		// }
		// Check trxns to show in trxn-history

		if (
			tmp_lst[i].history_label &&
			tmp_lst[i].history_label.length > 0 &&
			tmp_lst[i].interaction_type_id > 0
		) {
			_tx_to_show_in_hist.push({
				id: tmp_lst[i].id,
				type_id: tmp_lst[i].interaction_type_id,
				hist_label: tmp_lst[i].history_label,
			});
		}

		// Hide Invisible interactions -----------------------------------
		if (tmp_lst[i].is_visible == 0) {
			continue;
		}

		if (!("icon" in tmp_lst[i])) {
			tmp_lst[i].icon = "";
		}

		if (!("released_days_ago" in tmp_lst[i])) {
			tmp_lst[i].released_days_ago = -999;
		}

		// // Calculate shortcut key
		// k = tmp_lst[i].label.substr(0,1).toLowerCase();

		// // tmp_lst[i].key = '';

		// if (typeof(this._keys[k]) !== 'undefined')	// If key already assigned
		// {
		//   l = 1;
		//   //var _lbl = tmp_lst[i]['label'].match(/\b(\w)/g).join('').toLowerCase() +
		//   //	tmp_lst[i]['label'].replace(/[^a-zA-Z]+/g,'').toLowerCase() +
		//   //	'zyqpjduxcvlkswntfobigrhame';		//allow other letters as shortcut (sorted by reverse order of popularity of letters in common words)
		//    TO SUPPORT HINDI n other INTERNATIONAL CHARACTERS: .match(/(^|[- _,.()])[^- _,.()]/g).map(function(a){return a.length>1? a[1] : a}).join(.......)

		//   _lbl = tmp_lst[i].label.match(/(^|[- _,.()/&0-9])[^- _,.()/&0-9]/g).map(function(a){
		//         return a.length>1? a[1] : a;
		//       }).join('').toLowerCase() +
		//     tmp_lst[i].label.replace(/[^a-zA-Z]+/g,'').toLowerCase() +
		//     'zyqpjuxcvlkswntobigramdef';		//allow other letters as shortcut (sorted by reverse order of popularity of letters in common words)
		//   m = _lbl.length;
		//   do
		//   {
		//     k = _lbl.substr(l,1);
		//     l++;
		//   } while (typeof(this._keys[k]) !== 'undefined' && l<m);

		//   if (typeof(this._keys[k]) === 'undefined' && k)
		//   {
		//     this._keys[k] = '/transaction/'+tmp_lst[i].id;
		//     tmp_global_keys += ' ' + this._key_modifier + '+' + k;
		//     tmp_lst[i].key = k;

		//     // if (this._is_macos)
		//     // {
		//     // 	tmp_global_keys += ' ' + this._char_to_mac_altkey_map[k] +
		//     // 			' ' + this._char_to_mac_altkey_map_CAPS[k];
		//     // }
		//   }
		// }
		// else
		// {
		//   this._keys[k] = '/transaction/' + tmp_lst[i].id;
		//   tmp_global_keys += ' ' + this._key_modifier + '+' + k;
		//   tmp_lst[i].key = k;

		//   // if (this._is_macos)
		//   // {
		//   // 	tmp_global_keys += ' ' + this._char_to_mac_altkey_map[k] +
		//   // 			' ' + this._char_to_mac_altkey_map_CAPS[k];
		//   // }
		// }

		if (tmp_lst[i].key) {
			role_tx_list[tmp_lst[i].id].key = tmp_lst[i].key;
		}

		// Process Category Name...
		if (tmp_lst[i]["category"] === last_category) {
			tmp_lst[i].category = ""; // Only let category name be present with the first transaction entry in that category
		} else {
			last_category = tmp_lst[i].category;
		}

		interaction_list.push(tmp_lst[i]);
		// console.log("tmp_lst[i]", tmp_lst[i].category);
	}

	return {
		role_tx_list,
		interaction_list,
	};
};
