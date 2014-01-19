/** @jsx React.DOM */



var MarkdownParagraph = React.createClass({
    render: function() {
        var refs = this.props.refs;
        var children = _.map(this.props.children, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <p className="markdown-p">{children}</p>;
    }
});

var MarkdownEmphasis = React.createClass({
    render: function() {
        var refs = this.props.refs;
        var children = _.map(this.props.children, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <em className="markdown-em">{children}</em>;
    }
});

var MarkdownStrong = React.createClass({
    render: function() {
        var refs = this.props.refs;
        var children = _.map(this.props.children, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <strong className="markdown-strong">{children}</strong>;
    }
});

var MarkdownHeader = React.createClass({
    render: function() {
        var config = this.props.children[0];
        var refs = this.props.refs;
        var subTree = this.props.children.slice(1);
        var nodeType = React.DOM['h' + config.level];

        var children = _.map(subTree, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <nodeType className="markdown-header">{children}</nodeType>;
    }
});


var MarkdownListItem = React.createClass({
    render: function() {
        var refs = this.props.refs;
        var children = _.map(this.props.children, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <li className="markdown-li">{children}</li>;
    }
});

var MarkdownUnorderedList = React.createClass({
    render: function() {
        var children = _.map(this.props.children, _.partial(componentFromMarkdownArray, this.props.refs));
        return <ul className="markdown-ul">{children}</ul>;
    }
});

var MarkdownOrderedList = React.createClass({
    render: function() {
        var children = _.map(this.props.children, _.partial(componentFromMarkdownArray, this.props.refs));
        return <ol className="markdown-ol">{children}</ol>;
    }
});

var MarkdownHorizontalRule = React.createClass({
    render: function() {
        return <hr className="markdown-hr" />;
    }
});

var MarkdownCodeBlock = React.createClass({
    render: function() {
        var refs = this.props.refs;
        var children = _.map(this.props.children, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <pre className="markdown-code-block"><code>{children}</code></pre>;
    }
});

var MarkdownBlockquote = React.createClass({
    render: function() {
        var refs = this.props.refs;
        var children = _.map(this.props.children, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <blockquote className="markdown-blockquote">{children}</blockquote>;
    }
});

var MarkdownInlineCode = React.createClass({
    render: function() {
        var refs = this.props.refs;
        var children = _.map(this.props.children, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <code className="markdown-code-block">{children}</code>;
    }
});

var MarkdownLink = React.createClass({
    render: function() {
        var config = this.props.children[0];
        var subTree = this.props.children.slice(1);
        var href = config.href;
        var refs = this.props.refs;

        var children = _.map(subTree, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });
        return <a href={href} className="markdown-link">{children}</a>;
    }
});

var MarkdownLinkRef = React.createClass({
    render: function() {
        var ref = this.props.children[0].ref;
        var subTree = this.props.children.slice(1);
        var refs = this.props.refs;
        var href = refs[ref].href;

        var children = _.map(subTree, function(child) {
            if (_.isString(child)) {
                return child;
            }
            if (_.isArray(child)) {
                return componentFromMarkdownArray(refs, child);
            };
        });

        return <a href={href}>{children}</a>;
    }
});

var MarkdownImageRef = React.createClass({
    render: function() {
        var config = this.props.children[0];
        var subTree = this.props.children.slice(1);
        var refs = this.props.refs;
        var src = refs[config.ref].href;
        return <img src={src} alt={config.alt} />;
    }
});

var markdownComponentMap = {
    para: MarkdownParagraph,
    em: MarkdownEmphasis,
    strong: MarkdownStrong,
    header: MarkdownHeader,
    bulletlist: MarkdownUnorderedList,
    numberlist: MarkdownOrderedList,
    listitem: MarkdownListItem,
    hr: MarkdownHorizontalRule,
    blockquote: MarkdownBlockquote,
    code_block: MarkdownCodeBlock,
    inlinecode: MarkdownInlineCode,
    link: MarkdownLink,
    link_ref: MarkdownLinkRef,
    img_ref: MarkdownImageRef,
};

var componentFromMarkdownArray = function(refs, data) {
    var nodeType = data[0];
    var children = data.slice(1);

    console.log(nodeType);
    console.log(children);

    var componentType = markdownComponentMap[nodeType];

    return <componentType children={children} refs={refs} />;
};

var MarkdownRenderer = React.createClass({

    render: function() {
        var mdNodes = this.props.tree.slice(1);
        var refs = {};

        if (mdNodes.length > 0 && mdNodes[0].references !== undefined) {
            refs = mdNodes[0].references;

            console.log(refs);

            var mdNodes = mdNodes.slice(1);
        }
        var nodes = _.map(mdNodes, _.partial(componentFromMarkdownArray, refs));
        return <div className="markdown-preview">{nodes}</div>;
    }
});

var MarkdownContainer = React.createClass({
    mixins: [React.addons.LinkedStateMixin],

    getInitialState: function() {
        return {
            md: ''
        }
    },

    componentDidMount: function() {
        $.get('sample.md', _.bind(function(data) {
            this.setState({md: data});
        }, this));
    },

    render: function() {
        return (
            <div className="markdown-container">
                <textarea className="markdown-textarea" valueLink={this.linkState('md')} />
                <MarkdownRenderer tree={markdown.parse(this.state.md)} />
            </div>
        );
    }
});


React.renderComponent(
  <MarkdownContainer />,
  document.getElementById('application')
);