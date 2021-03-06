import React from "react";
import styled from "styled-components";
import style from "Shared/style-variables";

// LIBS
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";

// COMPONENTS
import { H2 } from "Components/H2";

const Div = styled.div`
  display: inline-block;
  margin-bottom: 40px;
  width: 100%;
`;

const DivTab = styled.div`
  display: inline-block;
  margin-bottom: 40px;
  width: 100%;
  border-bottom: 1px solid ${style.lightPurple};
  
`

const TabContent = styled.div`
  background-color: ${style.defaultPurple};
  border-bottom: 5px solid ${style.normalGreen};
  text-align: center;
  padding: 20px;
  width: 200px;
`;

const tabContentEnabled = {
  'backgroundColor': style.defaultPurple,
  'borderBottom': '5px solid ' + style.normalGreen,
  'float': 'left',
  'textAlign': 'center',
  'padding': '20px',
  'width': '200px',
  'cursor': 'default'
}

const tabContentDisabled = {
  'float': 'left',
  'textAlign': 'center',
  'padding': '20px',
  'width': '200px',
  'cursor': 'pointer'  
}

const tabStyleUl = {
  'listStyle': 'none',
  'marginBottom': '50px',
}

// Propriedades: tabTitle: String <Array> tabContent: HTML Content <Array>

class TabsBuilder extends React.Component {
  constructor() {
    super();
    this.state = { tabIndex: 0 };
  }
  
  renderTabList() {
    let { tabTitle } = this.props
    return (
      tabTitle.map((title, i) => {
        return (
          <Tab key={i} style={i === this.state.tabIndex ? tabContentEnabled : tabContentDisabled}>
            <H2 fontSize={"1.3rem"} txBold clWhite>
              { title }
            </H2>
          </Tab>
        )
      })
    );
  }

  renderTabPanel() {
    let { tabContent } = this.props
    return (
      tabContent.map((content, i) => {
        return (
          <TabPanel key={i}>
            { content }
          </TabPanel>
        )
      })
    );
  }

  render() {
    return (
      <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
        <DivTab> <TabList style={tabStyleUl}> { this.renderTabList() } </TabList> </DivTab>
        <Div> { this.renderTabPanel() } </Div>
      </Tabs> 
    );
  }
}

export default TabsBuilder;
