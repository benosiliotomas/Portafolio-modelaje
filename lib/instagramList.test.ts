import { describe, it, expect } from 'vitest';
import { addPost, movePost, removePost, resolvePostLinks } from './instagramList';

const A = 'https://www.instagram.com/reel/AAA/';
const B = 'https://www.instagram.com/reel/BBB/';
const C = 'https://www.instagram.com/p/CCC/';

describe('addPost', () => {
  it('appends the clean permalink of a valid link', () => {
    expect(addPost([A], 'https://www.instagram.com/p/CCC/?utm_source=ig_web_button_share_sheet&srtk=x')).toEqual({ list: [A, C] });
  });

  it('can insert at the top', () => {
    expect(addPost([A, B], C, 'top')).toEqual({ list: [C, A, B] });
  });

  it('explains why a link is rejected', () => {
    expect(addPost([A], 'https://www.instagram.com/benosiliotomas/')).toEqual({
      list: [A],
      error: 'Ese link no es un posteo, reel o video de Instagram.',
    });
    expect(addPost([A], 'https://instagram.com/benosiliotomas/reel/AAA/?igsh=1')).toEqual({
      list: [A],
      error: 'Ese posteo ya está en la lista.',
    });
  });

  it('does not mutate the list it receives', () => {
    const list = [A];
    addPost(list, B);
    expect(list).toEqual([A]);
  });
});

describe('movePost', () => {
  it('swaps with the neighbour in the given direction', () => {
    expect(movePost([A, B, C], 1, -1)).toEqual([B, A, C]);
    expect(movePost([A, B, C], 1, 1)).toEqual([A, C, B]);
  });

  it('keeps the list as is at the edges', () => {
    expect(movePost([A, B], 0, -1)).toEqual([A, B]);
    expect(movePost([A, B], 1, 1)).toEqual([A, B]);
  });
});

describe('removePost', () => {
  it('drops the post at the index', () => {
    expect(removePost([A, B, C], 1)).toEqual([A, C]);
  });
});

describe('resolvePostLinks', () => {
  it('uses the saved list, even when it is empty', () => {
    expect(resolvePostLinks({ status: 'saved', posts: [B] }, [A])).toEqual([B]);
    expect(resolvePostLinks({ status: 'saved', posts: [] }, [A])).toEqual([]);
  });

  it('falls back to the default list until the first save', () => {
    expect(resolvePostLinks({ status: 'missing' }, [A])).toEqual([A]);
  });

  it('shows nothing when the list could not be read', () => {
    expect(resolvePostLinks({ status: 'error' }, [A])).toEqual([]);
  });
});
