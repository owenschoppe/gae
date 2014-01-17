#!/usr/bin/perl -w


print "Content-type: text/html\n\n\n";
#print "hello ";


use LWP::Simple;
use HTML::TreeBuilder 5 -weak;
use HTML::Entities;
use HTML::Element;
use JSON;

my $url = 'http://www.economist.com/content/business-this-week';

#my $content = get $url;
#die "Couldn't get $url" unless defined $content;

#print $content;

my $tree = HTML::TreeBuilder->new_from_url($url);

$tree->elementify;


my $content = $tree->look_down( _tag => "div", "class" => "main-content"  );



my $data = $content->as_HTML ('<>&');
#my $json_text = to_json( $content->as_trimmed_text );
#my $json_text = JSON->new->utf8(1)->pretty(1)->encode($content);
#$json_text->as_trimmed_text;

print $data;
#print to the window