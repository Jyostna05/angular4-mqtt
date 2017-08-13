
/**
 * Represents a configuration object for the
 * Service to connect to, pub, and sub.
 */
export interface Config {
  // Which server?
  server: string;   // 'localhost' or '127.0.0.1'
  port: number;   // 15675
  path: string; // sub location
  protocol: string;  //protocol
  ssl: boolean;   // false
  clientId: string;
  // What credentials?
  user: string;
  pass: string;

  // Which queues?
  publish_topic: string[];
  subscribe_topic: string[];

  // How often to heartbeat?
  keepalive?: number;
};
