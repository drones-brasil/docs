import React, {type ReactNode} from 'react';
import clsx from 'clsx';

import {useDoc} from '@docusaurus/plugin-content-docs/client';

import Heading from '@theme/Heading';
import MDXContent from '@theme/MDXContent';

import {DocMetaHeader} from '@site/src/components/DocMetaHeader/DocMetaHeader';

/**
 * Title can be declared inside md content or declared through
 * front matter and added manually. To make both cases consistent,
 * the added title is added under the same div.markdown block.
 *
 * We render a "synthetic title" if:
 * - user doesn't ask to hide it with front matter
 * - the markdown content does not already contain a top-level h1 heading
 */
function useSyntheticTitle(): string | null {
  const {metadata, frontMatter, contentTitle} = useDoc();
  const shouldRender =
    !frontMatter.hide_title && typeof contentTitle === 'undefined';
  if (!shouldRender) return null;
  return metadata.title;
}

export default function DocItemContent({children}: {children: ReactNode}): ReactNode {
  const syntheticTitle = useSyntheticTitle();
  const childArray = React.Children.toArray(children);
  const firstChild = childArray[0];
  const firstIsTitleHeader =
    React.isValidElement(firstChild) &&
    (firstChild.type === 'header' || firstChild.type === 'h1');

  return (
    <div className={clsx('theme-doc-markdown', 'markdown')}>
      {syntheticTitle ? (
        <>
          <header>
            <Heading as="h1">{syntheticTitle}</Heading>
          </header>
          <DocMetaHeader />
          <MDXContent children={children} />
        </>
      ) : (
        <MDXContent
          children={
            firstIsTitleHeader
              ? [
                  firstChild,
                  <DocMetaHeader key="doc-meta-header" />,
                  ...childArray.slice(1),
                ]
              : [<DocMetaHeader key="doc-meta-header" />, ...childArray]
          }
        />
      )}
    </div>
  );
}

