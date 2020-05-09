import PropTypes from "prop-types";
import React from "react";
import { graphql } from "gatsby";
import { ThemeContext } from "../layouts";
import Article from "../components/Article";
import Contact from "../components/Contact";
import Headline from "../components/Article/Headline";
import Seo from "../components/Seo";

const ContactPage = props => {
  const {
    data: {
      site: {
        siteMetadata: { facebook }
      }
      
    }
  } = props;

  return (
    <React.Fragment>
      <ThemeContext.Consumer>
        {theme => (
          <Article theme={theme}>
            <iframe 
              src="https://docs.google.com/forms/d/e/1FAIpQLSfI3K0z82W4_pyqaRP36zaVn4zrwTF74xb4jEV8QvV7HsW5MQ/viewform?embedded=true" 
              width="640" 
              height="940" 
              frameborder="0" 
              marginheight="0" 
              marginwidth="0"
              scrolling="no"
              >読み込んでいます…</iframe>
            {/* <header>
              <Headline title="Contact" theme={theme} />
            </header>
            <Contact theme={theme} /> */}
          </Article>
        )}
      </ThemeContext.Consumer>

      <Seo facebook={facebook} />
    </React.Fragment>
  );
};

ContactPage.propTypes = {
  data: PropTypes.object.isRequired
};

export default ContactPage;

//eslint-disable-next-line no-undef
export const query = graphql`
  query ContactQuery {
    site {
      siteMetadata {
        facebook {
          appId
        }
      }
    }
  }
`;
