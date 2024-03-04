import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import RedditProvider from "next-auth/providers/reddit";
import GitHubProvider from "next-auth/providers/github";
import TwitterProvider from "next-auth/providers/twitter";


import userData from '@/dummy.json';

export const {
  handlers: { GET, POST },
  auth,
} = NextAuth({
  session: { strategy: 'jwt' },

  providers: [

    CredentialsProvider({

      credentials: {
        username: {},
        password: {}
      },

      async authorize(credentials) {

        const username = credentials.username;
        const password = credentials.password;

        console.log(username);
        console.log(password);

        for (var index in userData.users) {

          let record = userData.users[index];
          var user = {}
          var flag=false;

          if(record.username==username) {
            if(record.password==password) {
              user = {
                id: record.id,
                name: record.username,
              }
              flag=true;
              break;
            } 
          }
        }

        if(flag) {
          return user;
        }

        return null;

      }
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    
    RedditProvider({
      clientId: process.env.REDDIT_CLIENT_ID,
      clientSecret: process.env.REDDIT_CLIENT_SECRET
    }),

    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET
    }),

    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET
    }),
  ],
})