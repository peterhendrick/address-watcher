import React from 'react';
import ReactDOM from 'react-dom';
import Transaction from './Transaction';
import enzyme from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16';
enzyme.configure({ adapter: new Adapter(Transaction) });

it('renders without crashing', () => {
//   const div = document.createElement('div');
//   const wrap = enzyme.shallow(
//       <Transaction />
//   );
//   wrap.setProps({ match: {params: { txId: "7f8467b7ae42fe2cc4befe63b8e705c539d0e919c9c510ef3602051056395a55" }}});
//   ReactDOM.render(wrap, div);
//   ReactDOM.unmountComponentAtNode(div);
});
