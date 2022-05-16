/**
 * Copyright (C) 2014 Jonathan Cuthbert <jon@cuth.net>
 * 
 * See https://github.com/jesstech/postcss-rem-to-pixel
 */
import * as postcss from 'postcss';
import { PrecalculateRemOptions } from './interfaces';

interface PrecalculateRemOptionsInternal extends PrecalculateRemOptions {
    unitPrecision: number;
    selectorBlackList: string[];
    mediaQuery: boolean;
}

const defaults: PrecalculateRemOptionsInternal = {
    rootValue: 16,
    unitPrecision: 5,
    selectorBlackList: [],
    propList: ['*'],
    replace: true,
    mediaQuery: false,
    minRemValue: 0
};

export const postCssPlugin = postcss.plugin('postcss-rem-to-pixel', (options: PrecalculateRemOptions) => {
    const opts: PrecalculateRemOptionsInternal = {
        ...defaults,
        ...options,
    };

    if (!opts.remScalerName) {
        throw Error(`'remScalerName' name was not defined, please check your plugin urn. Valid urn syntax: 'company:plugin:urn'`);
    }
    const remReplace = createRemReplace(opts.rootValue, opts.unitPrecision, opts.minRemValue, opts.remScalerName);

    const satisfyPropList = createPropListMatcher(opts.propList);

    return (css) => {
        if (options.replaceRootWithHost) {
            css.walkRules((rule, i) => {
                const rootSelectorIndex = rule.selector.indexOf(':root');
                if (rootSelectorIndex !== -1) {
                    rule.selector = rule.selector.replace(':root', ':host');
                }
            });
        }

        css.walkDecls((decl, i) => {
            // This should be the fastest test and will remove most declarations
            if (decl.value.indexOf('rem') === -1) {
                return;
            }

            if (!satisfyPropList(decl.prop)) {
                return;
            }

            // TODO: `decl.parent.selector` is present in postcss version v5.2.18
            if (blacklistedSelector(opts.selectorBlackList, (decl.parent as { selector: string }).selector)) {
                return;
            }

            // calc(0.5 * 1rem)
            const value = decl.value.replace(remRegex, remReplace);

            // if px unit already exists, do not add or replace
            if (declarationExists(decl.parent, decl.prop, value)) {
                return;
            }

            if (opts.replace) {
                decl.value = value;
            } else {
                decl.parent.insertAfter(i, decl.clone({ value }));
            }
        });

        if (opts.mediaQuery) {
            css.walkAtRules('media', (rule) => {
                if (rule.params.indexOf('rem') === -1) {
                    return;
                }
                rule.params = rule.params.replace(remRegex, remReplace);
            });
        }

    };
});

function createRemReplace(rootValue, unitPrecision, minRemValue, scalerName: string) {
    /**
     * Example:
     * m = '0.1rem';
     * $1 = '0.1';
     */
    return (m, $1) => {
        if (!$1) {
            return m;
        }

        const result = `calc(var(--${scalerName}) * ${m})`;

        return result;
    };
}

function declarationExists(decls, prop, value) {
    return decls.some((decl) => {
        return (decl.prop === prop && decl.value === value);
    });
}

function blacklistedSelector(blacklist, selector) {
    if (typeof selector !== 'string') {
        return;
    }

    return blacklist.some((regex) => {
        if (typeof regex === 'string') {
            return selector.indexOf(regex) !== -1;
        }

        return selector.match(regex);
    });
}

function createPropListMatcher(propList) {
    const hasWild = propList.indexOf('*') > -1;
    const matchAll = (hasWild && propList.length === 1);
    const lists = {
        exact: filterPropList.exact(propList),
        contain: filterPropList.contain(propList),
        startWith: filterPropList.startWith(propList),
        endWith: filterPropList.endWith(propList),
        notExact: filterPropList.notExact(propList),
        notContain: filterPropList.notContain(propList),
        notStartWith: filterPropList.notStartWith(propList),
        notEndWith: filterPropList.notEndWith(propList)
    };
    return (prop) => {
        if (matchAll) {
            return true;
        }
        return (
            (
                hasWild ||
                lists.exact.indexOf(prop) > -1 ||
                lists.contain.some((m) => {
                    return prop.indexOf(m) > -1;
                }) ||
                lists.startWith.some((m) => {
                    return prop.indexOf(m) === 0;
                }) ||
                lists.endWith.some((m) => {
                    return prop.indexOf(m) === prop.length - m.length;
                })
            ) &&
            !(
                lists.notExact.indexOf(prop) > -1 ||
                lists.notContain.some((m) => {
                    return prop.indexOf(m) > -1;
                }) ||
                lists.notStartWith.some((m) => {
                    return prop.indexOf(m) === 0;
                }) ||
                lists.notEndWith.some((m) => {
                    return prop.indexOf(m) === prop.length - m.length;
                })
            )
        );
    };
}


// excluding regex trick: http://www.rexegg.com/regex-best-trick.html

// Not anything inside double quotes
// Not anything inside single quotes
// Not anything inside url()
// Any digit followed by rem
// !singlequotes|!doublequotes|!url()|remunit
const remRegex = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rem|-(\d*\.?\d+)rem/g;

const filterPropList = {
    exact: (list) => {
        return list.filter((m) => {
            return m.match(/^[^\*\!]+$/);
        });
    },
    contain: (list) => {
        return list.filter((m) => {
            return m.match(/^\*.+\*$/);
        }).map((m) => {
            return m.substr(1, m.length - 2);
        });
    },
    endWith: (list) => {
        return list.filter((m) => {
            return m.match(/^\*[^\*]+$/);
        }).map((m) => {
            return m.substr(1);
        });
    },
    startWith: (list) => {
        return list.filter((m) => {
            return m.match(/^[^\*\!]+\*$/);
        }).map((m) => {
            return m.substr(0, m.length - 1);
        });
    },
    notExact: (list) => {
        return list.filter((m) => {
            return m.match(/^\![^\*].*$/);
        }).map((m) => {
            return m.substr(1);
        });
    },
    notContain: (list) => {
        return list.filter((m)  => {
            return m.match(/^\!\*.+\*$/);
        }).map((m) => {
            return m.substr(2, m.length - 3);
        });
    },
    notEndWith: (list) => {
        return list.filter((m) => {
            return m.match(/^\!\*[^\*]+$/);
        }).map((m) => {
            return m.substr(2);
        });
    },
    notStartWith: (list) => {
        return list.filter((m) => {
            return m.match(/^\![^\*]+\*$/);
        }).map((m) => {
            return m.substr(1, m.length - 2);
        });
    }
};
