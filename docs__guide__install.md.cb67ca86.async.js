"use strict";(self.webpackChunkreact_virtual_sortable=self.webpackChunkreact_virtual_sortable||[]).push([[778],{24846:function(l,t,_){_.r(t);var r=_(72269),m=_(93359),s=_(61788),c=_(19977),v=_(4659),n=_(24268),h=_(96057),x=_(83213),i=_(88300),d=_(19130),u=_(67294),a=_(15207),e=_(85893);function o(){return(0,e.jsx)(i.dY,{children:(0,e.jsx)(u.Suspense,{fallback:(0,e.jsx)(d.Z,{}),children:(0,e.jsxs)(e.Fragment,{children:[(0,e.jsx)("div",{className:"markdown",children:(0,e.jsxs)("h2",{id:"installation",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#installation",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Installation"]})}),(0,e.jsxs)(s.Z,{children:[(0,e.jsx)(n.Z,{title:"npm",lang:"sh",children:a.texts[0].value}),(0,e.jsx)(n.Z,{title:"yarn",lang:"sh",children:a.texts[1].value})]}),(0,e.jsxs)("div",{className:"markdown",children:[(0,e.jsxs)("h2",{id:"simple-usage",children:[(0,e.jsx)("a",{"aria-hidden":"true",tabIndex:"-1",href:"#simple-usage",children:(0,e.jsx)("span",{className:"icon icon-link"})}),"Simple Usage"]}),(0,e.jsx)(n.Z,{lang:"tsx",children:a.texts[2].value})]})]})})})}t.default=o},15207:function(l,t,_){_.r(t),_.d(t,{texts:function(){return r}});const r=[{value:`$ npm i react-virtual-sortable
`,paraId:0},{value:`$ yarn add react-virtual-sortable
`,paraId:1},{value:`import VirtualList from 'react-virtual-sortable';

function Virtual() {

  const [list, setList] = useState([{id: '1', text: 'a'}, {id: '2', text: 'b'}, ...]);

  const onDrop = (event) => {
    // dnd complete
    setList(() => event.list);
  }

  // use style and className as jsx used
  return (
    <VirtualList
      style={{ height: '500px' }}
      dataKey="id"
      dataSource={ list }
      handle=".handle"
      onDrop={ onDrop }
    >
      {
        (record, index, dataKey) => {
          return (
            <div>
              <span className=".handle">{ index }</span>
              { record.text }
            </div>
          )
        }
      }
    </VirtualList>
  )
}
`,paraId:2,tocIndex:1}]}}]);
