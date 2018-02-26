setTimeout(function() {
        var table = document.querySelector("tbody");
                
        // submit button
        var submit = document.querySelector("#generate_query");
            
        // county and language lists
        var country_list = document.querySelector("#country_list");
        var language_list = document.querySelector("#language_list");
        var countries_selected = document.querySelector("#countries_selected");
        var languages_selected = document.querySelector("#languages_selected");

        // types (movies, series, episodes, games)       
        var type_overview = document.querySelector("#type_overview")

        // row types
        var qualifier_list_row = document.querySelectorAll(".qualifier_with_list");
        var checkbox_row = document.querySelectorAll(".checkbox_input");
        var number_row = document.querySelectorAll(".number_row");
        var date_row = document.querySelectorAll(".date_row");

        //currency tyep
        var currency_type = document.querySelector("#currency_q_1");

        // generate section
        var generate_section = document.querySelectorAll(".generate_section");
        var order_by = document.querySelector("#order_by");
        var limit = document.querySelector("#limit");
        var generated_query = document.querySelector("#generated_query");
        
        // dynamically display types to search for
        // can't do in loop- because of closures? There must be a way though
        type_overview.children[0].addEventListener("click", function() {
            type_overview.children[0].classList.toggle("label_off")
        });

        type_overview.children[1].addEventListener("click", function() {
            type_overview.children[1].classList.toggle("label_off")
        });

        type_overview.children[2].addEventListener("click", function() {
            type_overview.children[2].classList.toggle("label_off")
        });

        type_overview.children[3].addEventListener("click", function() {
            type_overview.children[3].classList.toggle("label_off")
        });


        
        // control which rows and row elements are and are not visible
        table.addEventListener('change', function() {
                // turn rows and content on/off when the switch is pressed
                for (var i = 0; i < table.childElementCount; i++) {
                        if(table.children[i].querySelector(".custom-control-input").checked) {
                                table.children[i].classList.remove("off");
                                table.children[i].children[2].classList.remove("content_off");
                        } else {
                                table.children[i].classList.add("off");
                                table.children[i].children[2].classList.add("content_off");
                        }
                }
                // turn between spans on/off for number rows when relevant
                for(var i=0; i < table.querySelectorAll(".number_row").length; i++) {
                    if(i==0) {
                        if (table.querySelectorAll(".number_row")[i].children[2].children[0].value == "BETWEEN ") {
                            table.querySelectorAll(".number_row")[i].children[2].children[3].classList.remove("content_off");
                        } else {
                            table.querySelectorAll(".number_row")[i].children[2].children[3].classList.add("content_off") 
                        }
                    } else if (table.querySelectorAll(".number_row")[i].children[2].children[0].value == "BETWEEN ") {
                        table.querySelectorAll(".number_row")[i].children[2].children[2].classList.remove("content_off");
                    } else {
                        table.querySelectorAll(".number_row")[i].children[2].children[2].classList.add("content_off") 
                    }
                }

                // turn between spans on/off for date rows when relevant
                for(var i=0; i < table.querySelectorAll(".date_row").length; i++) {
                    if (table.querySelectorAll(".date_row")[i].children[2].children[0].value == "BETWEEN ") {
                        table.querySelectorAll(".date_row")[i].children[2].children[2].classList.remove("content_off");
                    } else {
                        table.querySelectorAll(".date_row")[i].children[2].children[2].classList.add("content_off") 
                    }
                }

        });

        // Make the country selection easier
        for(var i=0; i < country_list.childElementCount; i++) {
            country_list[i].addEventListener("click", function(i) {
                var newHTML = "<span class='country' style='display: inline;'>".concat(i.toElement.innerHTML, "</span>")
                countries_selected.innerHTML += newHTML
                for(var j =0; j < countries_selected.childElementCount; j++) {
                    countries_selected.children[j].addEventListener("click",countries_selected.children[j].remove)   
                }
            })
        }

        // Make the language selection easier
        for(var i=0; i < language_list.childElementCount; i++) {
            language_list[i].addEventListener("click", function(i) {
                var newHTML = "<span class='language' style='display: inline;'>".concat(i.toElement.innerHTML, "</span>")
                languages_selected.innerHTML += newHTML
                for(var j =0; j < languages_selected.childElementCount; j++) {
                    languages_selected.children[j].addEventListener("click",languages_selected.children[j].remove)   
                }
            })
        }




        
        // After you click 'Generate query,' creates sql query text
        submit.addEventListener("click", function() {
        
                // creates query text for rows that have a any/all/none qualifier + text
                var qualifier_row_queries = [];
                for(var i=0; i<qualifier_list_row.length;i++){
                        // add - only apply if switch is on
                        if(qualifier_list_row[i].querySelector(".custom-control-input").checked) {
                                var section_name = qualifier_list_row[i].id;
                                var q_1 = qualifier_list_row[i].children[2].querySelector(".q_1").value;
                                var list_input = qualifier_list_row[i].children[2].querySelector(".list_input");
                                if(q_1 == "all") {
                                        var query_start = "(".concat(section_name, " LIKE ('%");
                                        var query_connector = "%') AND ".concat(section_name, " LIKE ('%");
                                } else if (q_1 == "none") {
                                        var query_start = "(".concat(section_name, " is NULL OR ", section_name, " NOT LIKE ('%");
                                        var query_connector = "%') AND ".concat(section_name, " NOT LIKE ('%");
                                } else {
                                        var query_start = "(".concat(section_name, " LIKE ('%");
                                        var query_connector = "%') OR ".concat(section_name, " LIKE ('%");
                                }
                                var list_prep = list_input.value.split(',');
                                var query_mid = list_prep.join(query_connector);
                                var query_end = "%')) AND ";
                                var query_whole = query_start.concat(query_mid + query_end);
                                qualifier_row_queries.push(query_whole);
                        }
                }
                var qualifier_row_query= qualifier_row_queries.join(" ");
                
                // create query text for rows that are checkboxes
                var checkbox_row_queries = [];
                for(var i=0; i<checkbox_row.length; i++){
                        if(checkbox_row[i].querySelector(".custom-control-input").checked){
                                var section_name = checkbox_row[i].id;
                                var check_list = checkbox_row[i].children[2].querySelector(".checkbox_grid_content");
                                var query_start = "(".concat(section_name, " LIKE ('%");
                                var query_connector = "%') OR ".concat(section_name, " LIKE ('%");
                                var selection_arr = [];
                                for(var j=0; j<check_list.childElementCount; j++){
                                        if(check_list.children[j].children[0].checked) {
                                                selection_arr.push(check_list.children[j].children[0].value);
                                        }
                                }
                                var query_mid = selection_arr.join(query_connector);
                                var query_end = "%'))  AND"
                                var query_whole = query_start.concat(query_mid, query_end);
                                checkbox_row_queries.push(query_whole);  
                        }
                        
                };
                var checkbox_row_query= checkbox_row_queries.join(" ");
        
                //type (movie/show/episode) query text
                var type_query_start = "type IN ('"
                var types_selected = []

                for(var i =0; i< type_overview.childElementCount; i++) {
                    if(!type_overview.children[i].classList.contains("label_off")) {
                        types_selected.push(type_overview.children[i].id)
                    }
                }

                var type_query_mid = types_selected.join("', '")
                var type_query_whole = type_query_start.concat(type_query_mid, "') AND ");
                
                // number row queries
                var number_row_queries = [];
                for(var i=0; i<number_row.length; i++) {
                        if(number_row[i].querySelector(".custom-control-input").checked) {
                                var section_name = number_row[i].id;
                                var input_1 = number_row[i].children[2].querySelector(".input_1").value;
                                var q_1 = number_row[i].children[2].querySelector(".q_1").value;
                                if (q_1 == "BETWEEN ") {
                                        var query_start = "(".concat(section_name, " BETWEEN " );
                                        var input_2 = number_row[i].children[2].querySelector(".input_2").value
                                        var query_end = input_1.concat(" AND ", input_2, ") AND ");
                                } else {
                                        var query_start = "(".concat(section_name);
                                        var query_end = q_1.concat(input_1, ") AND ");
                                }
                                var query_whole = query_start.concat(query_end);
                                number_row_queries.push(query_whole);
                        }
                }
                var number_row_query= number_row_queries.join(" ");
                
                // currency type query -> only if box office is checked
                var currency_type_query = "";
                if(number_row[0].querySelector(".custom-control-input").checked) {
                    var currency_type_query_start = "currencyType IN ('"

                    currency_type_query = currency_type_query_start.concat(currency_type.selectedOptions[0].value, "') AND ");
                };

                //date queries
                var date_row_queries = [];
                for(var i=0; i<date_row.length; i++) {
                        if(date_row[i].querySelector(".custom-control-input").checked) {
                                var section_name = date_row[i].id;
                                var input_1 = "'".concat(date_row[i].children[2].querySelector(".input_1").value, "'");
                                var q_1 = date_row[i].children[2].querySelector(".q_1").value;
                                if (q_1 == "BETWEEN ") {
                                        var date_query_start = "(".concat(section_name, " BETWEEN " );
                                        var input_2 = "'".concat(date_row[i].children[2].querySelector(".input_2").value, "'");
                                        var date_query_end = input_1.concat(" AND ", input_2, ") AND ");
                                } else {
                                        var date_query_start = "(".concat(section_name);
                                        var date_query_end = q_1.concat(input_1, ") AND ");
                                }
                                var date_query_whole = date_query_start.concat(date_query_end);
                                date_row_queries.push(date_query_whole);
                        }
                }
                var date_row_query= date_row_queries.join(" ");
        
                // Can combine country and language query
                var country_row = document.querySelector("#Country");
                if(country_row.querySelector(".custom-control-input").checked) {
                        var country_query_start = "(Country LIKE ('%"
                        var country_connector = "%') OR Country LIKE ('%";
                        var country_arr = [];
                        for(var i=0; i<countries_selected.childElementCount; i++) {
                                country_arr.push(countries_selected.children[i].innerText);
                        }
                        var country_query_mid = country_arr.join(country_connector);
                        var country_query_end = "%')) AND "
                        var country_query_whole = country_query_start.concat(country_query_mid, country_query_end);
                } else {
                        country_query_whole = ""
                }
                
                var language_row = document.querySelector("#Language");
                if(language_row.querySelector(".custom-control-input").checked) {
                        var language_query_start = "(Language LIKE ('%"
                        var language_connector = "%') OR Language LIKE ('%";
                        var language_arr = [];
                        for(var i=0; i<languages_selected.childElementCount; i++) {
                                language_arr.push(languages_selected.children[i].innerText);
                        }
                        var language_query_mid = language_arr.join(language_connector);
                        var language_query_end = "%')) AND "
                        var language_query_whole = language_query_start.concat(language_query_mid, language_query_end);
                } else {
                        language_query_whole = ""
                }

                     
                var final_q = "SELECT * FROM omdb WHERE ".concat(type_query_whole, qualifier_row_query, date_row_query, checkbox_row_query, number_row_query, country_query_whole, language_query_whole, currency_type_query);
                // remove the last "AND"
                if(final_q.length>25) {
                    final_q = final_q.slice(0, -4);
                } else {
                    final_q = final_q.slice(0, -7);
                }

                if(order_by.value.length>0) {
                        final_q= final_q.concat(" ORDER BY ", order_by.value);
                }

                final_q = final_q.concat("LIMIT ", limit.value);
                
                generate_section[3].classList.remove("content_off");
                generated_query.value = final_q;
        
}), 1000})