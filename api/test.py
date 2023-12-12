def transform_expression(input_string):
    operators = {'=': 'equal_', '>': 'gt_', '<': 'lt_', '>=': 'gte_', '<=': 'lte_'}

    operand1 = ""
    operator = ""
    operand2 = ""
    for char in input_string:
        if char.isalnum() or char == ' ':
            if not operator:
                operand1 += char
            else:
                operand2 += char
        else:
            operator += char

    if operator in operators:
        transformed_string = f'{operators[operator]}("{operand1.strip()}", "{operand2.strip()}")'
        return transformed_string
    else:
        raise Exception("Invalid expression")

# Example usage:
input_string = "name = ismail"
result = transform_expression(input_string)
print(result)
