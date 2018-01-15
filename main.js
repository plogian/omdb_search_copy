setTimeout(function() {
        var table = document.querySelector("tbody");
                
        // submit button
        var submit = document.querySelector("#generate_query");
                
        // Selecting inputs for SQL query
        // If time, clean up movie/show/episode code 
        var movie_label = document.querySelector("#movies");
        var show_label = document.querySelector("#shows");
        var episode_label = document.querySelector("#episodes");
        var type_movie = document.querySelector("#type_movie");
        var type_tvshow = document.querySelector("#type_tvshow");
        var type_episode = document.querySelector("#type_episode");
        var type_query_start = "type IN (";
        var country_list = document.querySelector("#country_list");
        var language_list = document.querySelector("#language_list");
        var type_movie_query = "'movie'";
        var type_show_query = "'series'";
        var type_episode_query = "'episodes'";
        var qualifier_list_row = document.querySelectorAll(".qualifier_with_list");
        var checkbox_row = document.querySelectorAll(".checkbox_input");
        var generated_query = document.querySelector("#generated_query");
        var number_row = document.querySelectorAll(".number_row");
        var date_row = document.querySelectorAll(".date_row");
        var generate_section = document.querySelectorAll(".generate_section");
        var order_by = document.querySelector("#order_by");
        var send_query = document.querySelector("#send_query");
        
        type_movie.addEventListener( 'change', function() {
                if(this.checked) {
                        // Checkbox is checked..
                        type_movie_query = "'movie'";
                        movie_label.classList.toggle("label_off");
                } else {
                        type_movie_query = "";
                        movie_label.classList.toggle("label_off");
            }
        });
        
        type_tvshow.addEventListener( 'change', function() {
            if(this.checked) {
                // Checkbox is checked..
                type_show_query = "'series'";
                show_label.classList.toggle("label_off");
            } else {
                type_show_query = "";
                show_label.classList.toggle("label_off");
            }
        });
        
        type_episode.addEventListener( 'change', function() {
            if(this.checked) {
                // Checkbox is checked..
                type_episode_query = "'episode'";
                episode_label.classList.toggle("label_off");
            } else {
                // Checkbox is not checked..
                type_episode_query = "";
                episode_label.classList.toggle("label_off");
            }
        });
        
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
                        if(table.querySelectorAll(".number_row")[i].children[2].children[0].value == "BETWEEN ") {
                                table.querySelectorAll(".number_row")[i].children[2].children[2].classList.remove("content_off");
                        } else {
                               table.querySelectorAll(".number_row")[i].children[2].children[2].classList.add("content_off") 
                        }
                }
        });
        
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
                                var query_end = "%')) AND"
                                var query_whole = query_start.concat(query_mid, query_end);
                                checkbox_row_queries.push(query_whole);  
                        }
                        
                };
                var checkbox_row_query= checkbox_row_queries.join(" ");
        
                // type (movie/show/episode) query text
                // this is commented out for now, since the type column is missing
                // var type_query_mid = [type_movie_query, type_show_query, type_episode_query].filter(function (val) {return val;}).join(', ');
                // var type_query_whole = type_query_start.concat(type_query_mid, ") AND ");
                var type_query_whole = "";
                
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
                        var country_amount = country_list.selectedOptions.length
                        var country_arr = [];
                        for(var i=0; i<country_amount; i++) {
                                country_arr.push(country_list.selectedOptions[i].innerText);
                        }
                        var country_query_mid = country_arr.join(country_connector);
                        var country_query_end = "%')) AND "
                        var country_query_whole = country_query_start.concat(country_query_mid, country_query_end);
                } else {
                        country_query_whole = ""
                }
                
                var language_row = document.querySelector("#Language")
                if(language_row.querySelector(".custom-control-input").checked) {
                        var language_query_start = "(Language LIKE ('%"
                        var language_connector = "%') OR Language LIKE ('%";
                        var language_amount = language_list.selectedOptions.length
                        var language_arr = [];
                        for(var i=0; i<language_amount; i++) {
                                language_arr.push(language_list.selectedOptions[i].innerText);
                        }
                        var language_query_mid = language_arr.join(language_connector);
                        var language_query_end = "%')) AND "
                        var language_query_whole = language_query_start.concat(language_query_mid, language_query_end); 
                } else {
                        language_query_whole = ""
                }
                     
                var final_q = "SELECT * FROM omdbunique WHERE ".concat(type_query_whole, qualifier_row_query, date_row_query, checkbox_row_query, number_row_query, country_query_whole,  language_query_whole);
                // remove the last "AND"
                final_q = final_q.slice(0, -4);
                
                if(order_by.value.length>0) {
                        final_q= final_q.concat(" ORDER BY ", order_by.value);
                }
                console.log(final_q);
                
                generate_section[2].classList.remove("content_off");
                generated_query.value = final_q;
        
}), 1000})