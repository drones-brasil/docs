import React, {useMemo} from 'react';

import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {useDoc} from '@docusaurus/plugin-content-docs/client';

import {AUTHORS} from '@site/src/generated/authors';
import {TEAMS} from '@site/src/generated/teams';

import styles from './DocMetaHeader.module.css';

type Level = 'basic' | 'intermediate' | 'advanced';
type ContentType = 'tutorial' | 'aula' | 'lab' | 'doc';

function titleCase(s: string) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function levelLabel(level: string): string {
  switch (level) {
    case 'basic':
      return 'Básico';
    case 'intermediate':
      return 'Intermediário';
    case 'advanced':
      return 'Avançado';
    default:
      return level;
  }
}

function contentTypeLabel(t: string): string {
  switch (t) {
    case 'aula':
      return 'Aula';
    case 'tutorial':
      return 'Tutorial';
    case 'lab':
      return 'Lab';
    case 'doc':
      return 'Doc';
    default:
      return titleCase(t);
  }
}

function levelClass(level?: string) {
  switch (level) {
    case 'basic':
      return styles.chipLevelBasic;
    case 'intermediate':
      return styles.chipLevelIntermediate;
    case 'advanced':
      return styles.chipLevelAdvanced;
    default:
      return styles.chipMuted;
  }
}

export function DocMetaHeader() {
  const {frontMatter, metadata} = useDoc();
  const fm = (frontMatter ?? {}) as any;

  const summary: string | undefined =
    fm.summary ?? fm.description ?? (metadata as any)?.description;
  const level: Level | undefined = fm.level;
  const contentType: ContentType | undefined = fm.contentType;
  const keywords: string[] = Array.isArray(fm.keywords) ? fm.keywords : [];
  const authorIds: string[] = Array.isArray(fm.authors) ? fm.authors : [];

  const primaryAuthor = useMemo(() => {
    const id = authorIds?.[0];
    if (!id) return null;
    return {id, author: (AUTHORS as any)[id] as any};
  }, [authorIds]);

  const team = useMemo(() => {
    const tId = primaryAuthor?.author?.teamId;
    if (!tId) return null;
    return {id: tId, team: (TEAMS as any)[tId] as any};
  }, [primaryAuthor]);

  // If a page doesn't declare meta, keep it minimal and out of the way
  const shouldRender =
    Boolean(summary) ||
    Boolean(level) ||
    Boolean(contentType) ||
    keywords.length > 0 ||
    Boolean(primaryAuthor?.author);

  if (!shouldRender) return null;

  const teamName = team?.team?.name;
  const uniName = team?.team?.university;
  const gitUrl = team?.team?.gitOrgUrl;
  const authorLinkedin = primaryAuthor?.author?.linkedin;
  const teamLinkedin = team?.team?.linkedin;
  const authorPhoto = primaryAuthor
    ? useBaseUrl(`/img/authors/${primaryAuthor.id}.webp`)
    : undefined;
  const teamLogo = team ? useBaseUrl(`/img/teams/${team.id}.webp`) : undefined;
  const universityLogo = uniName
    ? useBaseUrl(`/img/universities/${uniName}.webp`)
    : undefined;

  const authorGithub = gitUrl;
  const authorHasFlip = Boolean(authorLinkedin || authorGithub);
  const teamGithub = gitUrl;
  const teamHasFlip = Boolean(teamLinkedin || teamGithub);
  const uniHasFlip = teamHasFlip;

  return (
    <div className={styles.wrap}>
      {summary ? <p className={styles.summary}>{summary}</p> : null}

      <div className={styles.chips}>
        {contentType ? (
          <span className={`${styles.chip} ${styles.chipType}`}>
            {contentTypeLabel(contentType)}
          </span>
        ) : null}
        {level ? (
          <span className={`${styles.chip} ${levelClass(level)}`}>
            {levelLabel(level)}
          </span>
        ) : null}
        {keywords.map((k) => (
          <span key={k} className={`${styles.chip} ${styles.chipKey}`}>
            {k}
          </span>
        ))}
      </div>

      {primaryAuthor?.author || team ? (
        <div className={styles.peopleRow}>
          {primaryAuthor?.author ? (
            <div className={styles.person}>
              <div className={styles.badgeGroup}>
                <div className={styles.flipCard} data-enabled={authorHasFlip ? 'y' : 'n'}>
                  <div className={styles.flipInner}>
                    <div className={`${styles.flipFace} ${styles.flipFront}`}>
                      {authorPhoto ? (
                        <img
                          className={styles.faceImg}
                          src={authorPhoto}
                          alt={primaryAuthor.author.name ?? 'Autor'}
                          loading="lazy"
                        />
                      ) : null}
                    </div>
                    <div className={`${styles.flipFace} ${styles.flipBack}`}>
                      <div className={styles.iconRow}>
                        {authorGithub ? (
                          <Link className={styles.iconLink} to={authorGithub} aria-label="GitHub">
                            <span className={styles.icon} aria-hidden="true">
                              <svg viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="M12 .5C5.73.5.75 5.62.75 12c0 5.11 3.19 9.44 7.62 10.97.56.1.77-.25.77-.56v-2.09c-3.1.7-3.75-1.55-3.75-1.55-.5-1.33-1.22-1.68-1.22-1.68-1-.7.08-.69.08-.69 1.1.08 1.68 1.16 1.68 1.16.98 1.7 2.57 1.21 3.2.92.1-.73.38-1.21.69-1.49-2.47-.29-5.07-1.27-5.07-5.65 0-1.25.43-2.27 1.14-3.07-.12-.29-.5-1.46.11-3.04 0 0 .94-.31 3.08 1.17.9-.26 1.86-.39 2.82-.39.96 0 1.92.13 2.82.39 2.14-1.48 3.08-1.17 3.08-1.17.61 1.58.23 2.75.11 3.04.71.8 1.14 1.82 1.14 3.07 0 4.4-2.6 5.36-5.08 5.64.39.35.73 1.05.73 2.12v3.14c0 .31.2.66.78.55 4.42-1.53 7.61-5.86 7.61-10.96C23.25 5.62 18.27.5 12 .5Z"
                                />
                              </svg>
                            </span>
                          </Link>
                        ) : null}
                        {authorLinkedin ? (
                          <Link
                            className={styles.iconLink}
                            to={authorLinkedin}
                            aria-label="LinkedIn"
                          >
                            <span className={styles.icon} aria-hidden="true">
                              <svg viewBox="0 0 24 24">
                                <path
                                  fill="currentColor"
                                  d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V9H3.56v11.45Z"
                                />
                              </svg>
                            </span>
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.personText}>
                <div className={styles.personLabel}>Autor</div>
                <div className={styles.personName}>{primaryAuthor.author.name}</div>
                <div className={styles.personSub}>
                  {teamName ? teamName : uniName ? uniName : null}
                </div>
              </div>
            </div>
          ) : null}

          {team ? (
            <div className={styles.person}>
              <div className={styles.badgeGroup}>
                {teamLogo ? (
                  <div className={styles.flipCard} data-enabled={teamHasFlip ? 'y' : 'n'}>
                    <div className={styles.flipInner}>
                      <div className={`${styles.flipFace} ${styles.flipFront}`}>
                        <img
                          className={styles.faceImg}
                          src={teamLogo}
                          alt={teamName ?? 'Equipe'}
                          loading="lazy"
                        />
                      </div>
                      <div className={`${styles.flipFace} ${styles.flipBack}`}>
                        <div className={styles.iconRow}>
                          {teamGithub ? (
                            <Link className={styles.iconLink} to={teamGithub} aria-label="GitHub do time">
                              <span className={styles.icon} aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M12 .5C5.73.5.75 5.62.75 12c0 5.11 3.19 9.44 7.62 10.97.56.1.77-.25.77-.56v-2.09c-3.1.7-3.75-1.55-3.75-1.55-.5-1.33-1.22-1.68-1.22-1.68-1-.7.08-.69.08-.69 1.1.08 1.68 1.16 1.68 1.16.98 1.7 2.57 1.21 3.2.92.1-.73.38-1.21.69-1.49-2.47-.29-5.07-1.27-5.07-5.65 0-1.25.43-2.27 1.14-3.07-.12-.29-.5-1.46.11-3.04 0 0 .94-.31 3.08 1.17.9-.26 1.86-.39 2.82-.39.96 0 1.92.13 2.82.39 2.14-1.48 3.08-1.17 3.08-1.17.61 1.58.23 2.75.11 3.04.71.8 1.14 1.82 1.14 3.07 0 4.4-2.6 5.36-5.08 5.64.39.35.73 1.05.73 2.12v3.14c0 .31.2.66.78.55 4.42-1.53 7.61-5.86 7.61-10.96C23.25 5.62 18.27.5 12 .5Z"
                                  />
                                </svg>
                              </span>
                            </Link>
                          ) : null}
                          {teamLinkedin ? (
                            <Link
                              className={styles.iconLink}
                              to={teamLinkedin}
                              aria-label="LinkedIn do time"
                            >
                              <span className={styles.icon} aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V9H3.56v11.45Z"
                                  />
                                </svg>
                              </span>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}

                {universityLogo ? (
                  <div className={styles.flipCard} data-enabled={uniHasFlip ? 'y' : 'n'}>
                    <div className={styles.flipInner}>
                      <div className={`${styles.flipFace} ${styles.flipFront}`}>
                        <img
                          className={styles.faceImg}
                          src={universityLogo}
                          alt={uniName ?? 'Universidade'}
                          loading="lazy"
                        />
                      </div>
                      <div className={`${styles.flipFace} ${styles.flipBack}`}>
                        <div className={styles.iconRow}>
                          {teamGithub ? (
                            <Link
                              className={styles.iconLink}
                              to={teamGithub}
                              aria-label="GitHub do time"
                            >
                              <span className={styles.icon} aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M12 .5C5.73.5.75 5.62.75 12c0 5.11 3.19 9.44 7.62 10.97.56.1.77-.25.77-.56v-2.09c-3.1.7-3.75-1.55-3.75-1.55-.5-1.33-1.22-1.68-1.22-1.68-1-.7.08-.69.08-.69 1.1.08 1.68 1.16 1.68 1.16.98 1.7 2.57 1.21 3.2.92.1-.73.38-1.21.69-1.49-2.47-.29-5.07-1.27-5.07-5.65 0-1.25.43-2.27 1.14-3.07-.12-.29-.5-1.46.11-3.04 0 0 .94-.31 3.08 1.17.9-.26 1.86-.39 2.82-.39.96 0 1.92.13 2.82.39 2.14-1.48 3.08-1.17 3.08-1.17.61 1.58.23 2.75.11 3.04.71.8 1.14 1.82 1.14 3.07 0 4.4-2.6 5.36-5.08 5.64.39.35.73 1.05.73 2.12v3.14c0 .31.2.66.78.55 4.42-1.53 7.61-5.86 7.61-10.96C23.25 5.62 18.27.5 12 .5Z"
                                  />
                                </svg>
                              </span>
                            </Link>
                          ) : null}
                          {teamLinkedin ? (
                            <Link
                              className={styles.iconLink}
                              to={teamLinkedin}
                              aria-label="LinkedIn do time"
                            >
                              <span className={styles.icon} aria-hidden="true">
                                <svg viewBox="0 0 24 24">
                                  <path
                                    fill="currentColor"
                                    d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.15 1.45-2.15 2.95v5.66H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V9H3.56v11.45Z"
                                  />
                                </svg>
                              </span>
                            </Link>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className={styles.personText}>
                <div className={styles.personLabel}>Time</div>
                <div className={styles.personName}>{teamName ?? 'Equipe'}</div>
                <div className={styles.personSub}>{uniName ?? ''}</div>
              </div>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

