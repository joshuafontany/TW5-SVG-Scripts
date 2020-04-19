# This R script was offered at the game-icons.net Github repo, here:
# https://github.com/game-icons/icons/issues/429#issuecomment-454271162
#
# Requires R (& R for VSCode, R-Studio or similar)
# https://www.r-project.org/
# https://marketplace.visualstudio.com/items?itemName=Ikuyadeu.r
#
# You must `install.packages("NAME")` for all required libraries in an
# R terminal (+`reader`). To use, redownload the game-icons.net repo
# from github into an `icons` folder below this script folder.
# If R for VSCode is installed, run with Ctrl+Shft+S. Test runs can
# be done by changing the loop Max value to less than the array length.

library(rvest)
library(glue)
library(dplyr)
library(magrittr)

iconNames = list.files('./gameicons/icons/',recursive = TRUE) %>%
    tools::file_path_sans_ext() 
    # %>% 
    # stringr::str_replace('/svg/','/') 

iconNames = iconNames[!grepl('license',iconNames)]
iconNames = iconNames[!grepl('README',iconNames)]
iconNames = iconNames[!grepl('CONTRIBUTING',iconNames)]
iconNames = iconNames[!grepl('NA',iconNames)]

#print(iconNames)
allTags = list()
allDescriptions = list()
#for(icon in iconNames[1:10]){
for(icon in iconNames[1:length(iconNames)]){
    print(paste(icon, glue('https://game-icons.net/1x1/{icon}.html'), sep=": "))
    page = read_html(glue('https://game-icons.net/1x1/{icon}.html'))
    tags =page %>% 
        html_nodes('a[rel="tag"]') %>% 
        html_text()
    allTags[[icon]] = tags
    
    description = page %>% html_node('.description') %>% html_text(trim=TRUE)
    allDescriptions[[icon]] = description
}

allTags %>%
    sapply(function(x){paste(x,collapse = ' ')}) ->
    mergedTags

data.frame(name = names(mergedTags),
           tags = mergedTags,stringsAsFactors = FALSE,
           description = allDescriptions %>% unlist) ->
    tagFrame

readr::write_csv(tagFrame,'iconTags.csv',quote_escape = "backslash")
print('R Done')