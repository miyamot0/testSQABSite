/** @license
 *
 * Copyright (c) Shawn P. Gilroy, Louisiana State University.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import Enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ReactModal from 'react-modal';
import Registration from '../../registration/Registration';

Enzyme.configure({ adapter: new Adapter() });

ReactModal.setAppElement = () => null;

describe('Registration', () => {
  it('Should render', () => {
    const wrapper = mount(<Registration />);

    expect(wrapper.find(Registration).length).toBe(1);
  });
});
