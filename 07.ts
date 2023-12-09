#!/usr/bin/env ts-node

import { loadFromFile, sum } from "./lib";

async function main() {
  const lines: string[] = await loadFromFile("07-input.txt");
  const rounds = parseLines(lines);
  console.log(`Part 1: ${partOne(rounds)}`);
  console.log(`Part 2: ${partTwo(rounds)}`);
}

function partOne(rounds: Round[]): number {
  const scores = scoreHands(rounds);
  return sum(scores);
}

function partTwo(rounds: Round[]): number {
  const scores = scoreHands(rounds, true);
  return sum(scores);
}

function scoreHands(rounds: Round[], jokers: boolean = false): number[] {
  const rankedHands = [
    fiveOfAKind,
    fourOfAKind,
    fullHouse,
    threeOfAKind,
    twoPair,
    onePair,
    highCard,
  ].map((f) => rounds.filter((round) => {
      const hands = jokers ? replaceJokers(round.hand) : round.hand; 
      return f(cardCounts(hands));
    }) // group by hand type
    .sort((a, b) => {
      // order based on earliest different card
      for (let i = 0; i < a.hand.length; i++) {
        const diff = jokers ? jokerValue(b.hand[i]) - jokerValue(a.hand[i]) : b.hand[i] - a.hand[i];
        if (diff !== 0) return diff;
      }
      // if we've reached the end, they're identical
      return 0;
    }
  )).flat();

  return rankedHands.map(
    (round, i) => round.bid * (rankedHands.length - i)
  );
}

function jokerValue(card: Card): number {
  return card === Card.Jack ? -1 : card.valueOf();
}

function replaceJokers(hand: Card[]): Card[] {
  const counts = cardCounts(hand);

  const entries: Card[][] = [];
  for (const [card, number] of counts) {
    entries.push([card, number]);
  }
  // sort by card count then card value
  entries.sort((a, b) => {
    const countDiff = b[1] - a[1];
    if (countDiff !== 0) {
      return countDiff;
    } else {
      return jokerValue(b[0]) - jokerValue(a[0]);
    }
  });

  let bestCard: Card;
  if (entries[0][0] === Card.Jack && entries[0][1] === 5) {
    // all jokers, baby!
    bestCard = Card.Ace;
  } else if (entries[0][0] === Card.Jack) {
    // we have the most jacks of anything, so return the next card type
    bestCard = entries[1][0];
  } else {
    // otherwise use the top scoring other card
    bestCard = entries[0][0];
  }

  return hand.map(c => c === Card.Jack ? bestCard : c);
}

function fiveOfAKind(counts: CardCounts): boolean {
  for (const value of counts.values()) {
    if (value === 5) return true;
  }
  return false;
}

function fourOfAKind(counts: CardCounts): boolean {
  for (const value of counts.values()) {
    if (value === 4) return true;
  }
  return false;
}

function fullHouse(counts: CardCounts): boolean {
  const values: number[] = [];
  for (const value of counts.values()) {
    values.push(value);
  }
  return (values.includes(3) && values.includes(2));
}

function threeOfAKind(counts: CardCounts): boolean {
  const values: number[] = [];
  for (const value of counts.values()) {
    values.push(value);
  }
  return values.includes(3) && !values.includes(2); 
}

function twoPair(counts: CardCounts): boolean {
  let twoCount = 0;
  for (const value of counts.values()) {
    if (value === 2) twoCount += 1;
  }
  return twoCount === 2;
}

function onePair(counts: CardCounts): boolean {
  let twoCount = 0, values: number [] = [];
  for (const value of counts.values()) {
    if (value === 2) twoCount += 1;
    values.push(value);
  }
  return twoCount === 1 && !values.includes(3);
}

function highCard(counts: CardCounts): boolean {
  for (const value of counts.values()) {
    if (value !== 1) return false;
  }
  return true;
}

function cardCounts(hand: Card[]): CardCounts {
  const counts = new Map<Card, number>();
  for (const card of hand) {
    counts.set(card, (counts.get(card) || 0) + 1);
  }
  return counts;
}

function parseLines(lines: string[]): Round[] {
  return lines.map(parseLine);
}

function parseLine(line: string): Round {
  const [handStr, bidStr] = line.split(" ");
  return {
    hand: parseHand(handStr),
    bid: parseInt(bidStr, 10)
  };
}

function parseHand(s: string): Card[] {
  return s.split("").map(charToCard);
}

function charToCard(s: string): Card {
  const cardMap: Map<string, Card> = new Map([
    ["2", Card.Two],
    ["3", Card.Three],
    ["4", Card.Four],
    ["5", Card.Five],
    ["6", Card.Six],
    ["7", Card.Seven],
    ["8", Card.Eight],
    ["9", Card.Nine],
    ["T", Card.Ten],
    ["J", Card.Jack],
    ["Q", Card.Queen],
    ["K", Card.King],
    ["A", Card.Ace]
  ]);
  return cardMap.get(s) || Card.Two;
}

type CardCounts = Map<Card, number>;

type Round = {
  hand: Card[],
  bid: number
};

enum Card {
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen,
  King,
  Ace
}

main();
