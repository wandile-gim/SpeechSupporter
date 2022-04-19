def prev_next_post(obj):
    try:
        prevObj = obj.get_previous_by_update_dt()
        prevDict = {
            'id': prevObj.id,
            'title': prevObj.title,
        }
    except obj.DoesNotExist:
        prevDict = {}

    try:
        nextObj = obj.get_next_by_update_dt()
        nextDict = {
            'id': nextObj.id,
            'title': nextObj.title,
        }
    except obj.DoesNotExist:
        nextDict = {}

    return prevDict, nextDict