# coding: utf-8
#
# Copyright 2015 Maxim Puzanov. All Rights Reserved.

from extensions.gadgets import base


class GoToCard(base.BaseGadget):

    short_description = 'Go to Card'
    description = 'A simple \'go to card\' button.'
    height_px = 50
    width_px = 60
    panel = 'bottom'
    _dependency_ids = []

    _customization_arg_specs = [{
        'name': 'buttonText',
        'description': 'Button text',
        'schema': {
            'type': 'unicode',
        },
        'default_value': 'Go to Card'
    }, {
        'name': 'stateName',
        'description': 'State name',
        'schema': {
            'type': 'unicode',
            'validators': [{
                'id': 'is_nonempty',
            }]
        },
        'default_value': ''
    }, {
        'name': 'explorationId',
        'description': 'Exploration ID',
        'schema': {
            'type': 'unicode',
        },
        'default_value': ''
    }]
