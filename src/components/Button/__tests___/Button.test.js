import React from 'react';
import {shallow, render} from './../../../enzyme';

import Button from './../Button';

describe('Button', () => {
    it('renders button', () => {
        const wrapper = shallow(<Button buttonText={'submit'} />);

        expect(wrapper.text).toBe('submit');

    })
})