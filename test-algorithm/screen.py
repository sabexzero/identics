import json

def convert_text_to_json_string(input_text: str) -> str:
    """
    Преобразует многострочный текст в JSON-строку с явным экранированием \n.

    :param input_text: Многострочный текст
    :return: Текст в формате JSON-строки
    """
    # Используем json.dumps для преобразования текста с учётом экранирования
    json_string = json.dumps(input_text, ensure_ascii=False)
    return json_string

# Пример текста
multiline_text = """
Именно в Древней Греции в VI в. до н.э., в Самосе, в школе
Пифагора, сложилась музыкальная эстетика, которая просуществовала в европейской культуре до наших дней. Конечно, на протяжении
веков многие положения пифагорейской эстетики уточнялись и дополнялись, некоторые забылись, но общее эстетическое отношение к
музыке, и в первую очередь ее творцов, осталось «пифагорейским».
Слово «космос» первоначально обозначало у греков порядок, надлежащую меру, прекрасное устройство. Пифагор впервые
употребил его в сегодняшнем смысле для определения всего мироздания. Таким образом, мироздание для Пифагора – это упорядоченность, организованность, симметрия. Красота макрокосмоса –
Вселенной, считали пифагорейцы, открывается лишь тому, кто
ведет правильный, «прекрасно устроенный» образ жизни, т.е. в
своем внутреннем микрокосме поддерживает порядок и красоту.
Пифагорейский образ жизни имел великую космическую цель –
привнести гармонию мироздания в жизнь человека. И, как свидетельствует Ямвлих, Пифагор «установил в качестве первого» –
воспитание при помощи музыки.
Согласно Пифагору, Солнце, Луна и планеты, располагаясь
на небосклоне, соединяются в музыкальные созвучия. Так рождается чудесная музыка – musica mundana, без которой мир распался
бы на части. Земная же музыка – первое из искусств, дарующих
людям радость, – это, по мнению пифагорейцев, лишь отражение
мировой музыки, царящей среди небесных сфер.
Земная музыка как отголосок музыки небесной, мировой находила живейший отклик в душе человека, ибо сам человек был частичкой мироздания, и в нем изначально звучали мировые гармонии.
По учению пифагорейцев, каждая планета Солнечной системы имеет свой собственный тон, ее расстояние от Земли соответствует определенным музыкальным интервалам; «вечное кружение» планет и есть гармония, или музыка сфер. Пифагорейцы
придавали музыке универсальное значение. Распространяя законы
отношения музыкальных тонов на всю Вселенную, они создали
учение о космологическом значении музыки. Вселенная, которую
пифагорейцы представляли в виде гармонически настроенного
космоса, наполнена музыкой. Все мироздание, природа, человек,
согласно пифагорейцам, построены по законам музыкальной гармонии, и эта гармония образует единство мира.
"""

# Конвертируем текст
json_ready_text = convert_text_to_json_string(multiline_text)

# Выводим результат
print(json_ready_text)
