import re
from boolean_parser import parse


def is_func_call(string):
    pattern = r'(\w+)\((.*)\)'

    return re.match(pattern, string)


def parse_args(args_str):
    args = []
    current_arg = ''
    open_paren_count = 0

    for char in args_str:
        if char == ',' and open_paren_count == 0:
            args.append(current_arg.strip())
            current_arg = ''
        else:
            current_arg += char
            if char == '(':
                open_paren_count += 1
            elif char == ')':
                open_paren_count -= 1

    args.append(current_arg.strip())

    return list(map(transform, args))


def get_func_info(func_str):
    match = is_func_call(func_str)

    if match:
        func_name = match.group(1)
        args_str = match.group(2)

        args = parse_args(args_str) if args_str else []

        return func_name, args
    else:
        return func_str


def transform_expression(input_string):
    operators = {'=': 'equal_', '>': 'gt_', '<': 'lt_', '>=': 'gte_', '<=': 'lte_', '!=': 'ne_'}

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
        transformed_string = f"{operators[operator]}({operand1.strip()}, {operand2.strip()})"
        return transformed_string
    else:
        return input_string


def transform(arg):
    if is_func_call(arg):
        return get_func_info(arg)
    else:
        return get_func_info(transform_expression(arg))


def equal_(arg1, arg2, index):
    if arg1 == "content":
        list =  index.get(arg1).get(arg2, [])
        return [item['path'] for item in list]
    else:
        return index.get(arg1).get(arg2, [])


def ne_(arg1, arg2, index):
    values = [value for key, value in index.get(arg1, {}).items() if key != arg2]

    return [item for sublist in values for item in sublist]


def gt_(arg1, arg2, index):
    return []


def lt_(arg1, arg2, index):
    return []


def gte_(arg1, arg2, index):
    return []


def lte_(arg1, arg2, index):
    return []


def or_(arg1, arg2):
    return list(set(arg1) | set(arg2))


def and_(arg1, arg2):
    return list(set(arg1) & set(arg2))


def not_(arg1):
    return []


def evaluate(query, index):
    if query[0] == 'equal_':
        return equal_(query[1][0], query[1][1], index)
    if query[0] == 'ne_':
        return ne_(query[1][0], query[1][1], index)
    if query[0] == 'gt_':
        return gt_(query[1][0], query[1][1], index)
    if query[0] == 'lt_':
        return lt_(query[1][0], query[1][1], index)
    if query[0] == 'gte_':
        return gte_(query[1][0], query[1][1], index)
    if query[0] == 'lte_':
        return lte_(query[1][0], query[1][1], index)
    if query[0] == 'or_':
        return or_(evaluate(query[1][0], index), evaluate(query[1][1], index))
    if query[0] == 'and_':
        return and_(evaluate(query[1][0], index), evaluate(query[1][1], index))
    if query[0] == 'not_':
        return not_(evaluate(query[1][0], index))


def filter_from_index(query, index):
    parsed_query = str(parse(query))
    transformed_query = transform(parsed_query)

    return evaluate(transformed_query, index)
