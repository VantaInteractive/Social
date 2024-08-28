import PropTypes from 'prop-types';

import { defineMessages, injectIntl, FormattedMessage } from 'react-intl';

import { Helmet } from 'react-helmet';

import ImmutablePureComponent from 'react-immutable-pure-component';
import { connect } from 'react-redux';

import InfoIcon from '@/material-icons/400-24px/info.svg?react';
import Column from 'flavours/glitch/components/column';
import ColumnHeader from 'flavours/glitch/components/column_header';

const messages = defineMessages({
  heading: { id: 'markdown_guide.heading', defaultMessage: 'Markdown Guide' },
});

const mapStateToProps = state => ({
  collapseEnabled: state.getIn(['local_settings', 'collapsed', 'enabled']),
});

class MarkdownGuide extends ImmutablePureComponent {

  static propTypes = {
    intl: PropTypes.object.isRequired,
    multiColumn: PropTypes.bool,
    collapseEnabled: PropTypes.bool,
  };

  render () {
    const { intl, collapseEnabled, multiColumn } = this.props;

    return (
      <Column>
        <ColumnHeader
          title={intl.formatMessage(messages.heading)}
          icon='info-circle'
          iconComponent={InfoIcon}
          multiColumn={multiColumn}
        />

        <div className='markdown-guide scrollable optionally-scrollable'>
          <table>
            <thead>
              <tr>
                <th><FormattedMessage id='markdown_guide.syntax' defaultMessage='Syntax' /></th>
                <th><FormattedMessage id='markdown_guide.element' defaultMessage='Element' /></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><kbd>#</kbd>H1</td>
                <td><FormattedMessage id='markdown_guide.h1' defaultMessage='Header (biggest)' /></td>
              </tr>
              <tr>
                <td><kbd>#</kbd>H2</td>
                <td><FormattedMessage id='markdown_guide.h2' defaultMessage='Header (even bigger)' /></td>
              </tr>
              <tr>
                <td><kbd>#</kbd>H3</td>
                <td><FormattedMessage id='markdown_guide.h3' defaultMessage='Header (bigger)' /></td>
              </tr>
              <tr>
                <td><kbd>#</kbd>H4</td>
                <td><FormattedMessage id='markdown_guide.h4' defaultMessage='Header (smaller)' /></td>
              </tr>
              <tr>
                <td><kbd>#</kbd>H5</td>
                <td><FormattedMessage id='markdown_guide.h5' defaultMessage='Header (even smaller)' /></td>
              </tr>
              <tr>
                <td><kbd>#</kbd>H6</td>
                <td><FormattedMessage id='markdown_guide.h6' defaultMessage='Header (smallest)' /></td>
              </tr>
              <tr>
                <td><kbd>**</kbd>bold text<kbd>**</kbd></td>
                <td><FormattedMessage id='markdown_guide.bold' defaultMessage='Bold text' /></td>
              </tr>
              <tr>
                <td><kbd>*</kbd>italic text<kbd>*</kbd></td>
                <td><FormattedMessage id='markdown_guide.italic' defaultMessage='Italic (emphasized) text' /></td>
              </tr>
              <tr>
                <td><kbd>_</kbd>underlined text<kbd>_</kbd></td>
                <td><FormattedMessage id='markdown_guide.underline' defaultMessage='Underlined text' /></td>
              </tr>
              <tr>
                <td><kbd>{'>'}</kbd>quote</td>
                <td><FormattedMessage id='markdown_guide.quote' defaultMessage='Quoted text (blockquote)' /></td>
              </tr>
              <tr>
                <td><kbd>~~</kbd>strikethrough text<kbd>~~</kbd></td>
                <td><FormattedMessage id='markdown_guide.strikethrough' defaultMessage='Strikethrough text' /></td>
              </tr>
              <tr>
                <td><kbd>`</kbd>inline code<kbd>`</kbd></td>
                <td><FormattedMessage id='markdown_guide.codeinline' defaultMessage='Inline code' /></td>
              </tr>
              <tr>
                <td><kbd>{'<sub>'}</kbd>subscript text<kbd>{'</sub>'}</kbd></td>
                <td><FormattedMessage id='markdown_guide.subscript' defaultMessage='Subscript text' /></td>
              </tr>
              <tr>
                <td><kbd>{'<sup>'}</kbd>superscript text<kbd>{'</sup>'}</kbd></td>
                <td><FormattedMessage id='markdown_guide.superscript' defaultMessage='Superscript text' /></td>
              </tr>
              <tr>
                <td><kbd>1.</kbd>ordered list</td>
                <td><FormattedMessage id='markdown_guide.listordered' defaultMessage='Ordered list' /></td>
              </tr>
              <tr>
                <td><kbd>-</kbd>unordered list</td>
                <td><FormattedMessage id='markdown_guide.listunordered' defaultMessage='Unordered list' /></td>
              </tr>
              <tr>
                <td><kbd>```</kbd>code block<kbd>```</kbd></td>
                <td><FormattedMessage id='markdown_guide.codeblock' defaultMessage='Code block (Note: put ``` on a new list, always)' /></td>
              </tr>
            </tbody>
          </table>
        </div>

        <Helmet>
          <meta name='robots' content='noindex' />
        </Helmet>
      </Column>
    );
  }

}

export default connect(mapStateToProps)(injectIntl(MarkdownGuide));